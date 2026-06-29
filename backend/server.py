from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
import requests as http_requests
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Depends, Query, Header
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from io import BytesIO

# ---------------- Config ----------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = 'HS256'
ADMIN_EMAIL = os.environ['ADMIN_EMAIL']
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

STORAGE_URL = 'https://integrations.emergentagent.com/objstore/api/v1/storage'
APP_NAME = 'rainbowstar'
storage_key_cache = {'key': None}

app = FastAPI(title='Rainbow Star API')
api_router = APIRouter(prefix='/api')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('rainbowstar')

# ---------------- Auth helpers ----------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {'sub': user_id, 'email': email, 'role': role,
               'exp': datetime.now(timezone.utc) + timedelta(hours=12), 'type': 'access'}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def set_auth_cookies(response: Response, token: str):
    response.set_cookie(key='access_token', value=token, httponly=True, secure=False,
                       samesite='lax', max_age=43200, path='/')

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get('access_token')
    if not token:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail='Not authenticated')
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({'_id': ObjectId(payload['sub'])})
        if not user:
            raise HTTPException(status_code=401, detail='User not found')
        user['id'] = str(user['_id'])
        del user['_id']
        user.pop('password_hash', None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Admin access required')
    return user

# ---------------- Storage helpers ----------------
def init_storage():
    if storage_key_cache['key']:
        return storage_key_cache['key']
    try:
        resp = http_requests.post(f'{STORAGE_URL}/init', json={'emergent_key': EMERGENT_LLM_KEY}, timeout=30)
        resp.raise_for_status()
        storage_key_cache['key'] = resp.json()['storage_key']
        return storage_key_cache['key']
    except Exception as e:
        logger.error(f'Storage init failed: {e}')
        return None

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail='Storage unavailable')
    resp = http_requests.put(f'{STORAGE_URL}/objects/{path}',
                              headers={'X-Storage-Key': key, 'Content-Type': content_type},
                              data=data, timeout=120)
    if resp.status_code == 403:
        storage_key_cache['key'] = None
        key = init_storage()
        resp = http_requests.put(f'{STORAGE_URL}/objects/{path}',
                                  headers={'X-Storage-Key': key, 'Content-Type': content_type},
                                  data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail='Storage unavailable')
    resp = http_requests.get(f'{STORAGE_URL}/objects/{path}',
                              headers={'X-Storage-Key': key}, timeout=60)
    if resp.status_code == 403:
        storage_key_cache['key'] = None
        key = init_storage()
        resp = http_requests.get(f'{STORAGE_URL}/objects/{path}',
                                  headers={'X-Storage-Key': key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get('Content-Type', 'application/octet-stream')

# ---------------- Models ----------------
class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    name: str
    company: Optional[str] = None
    phone: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class DiamondIn(BaseModel):
    stock_id: str
    category: str  # 'cvd' | 'natural' | 'argyle_pink' | 'argyle_blue'
    shape: str
    carat: float
    color: str
    clarity: str
    cut: Optional[str] = None
    polish: Optional[str] = None
    symmetry: Optional[str] = None
    fluorescence: Optional[str] = None
    certificate_lab: Optional[str] = None
    certificate_number: Optional[str] = None
    certificate_url: Optional[str] = None
    price_per_carat: float = 0
    total_price: float = 0
    origin: Optional[str] = None
    diamond_type: Optional[str] = None  # IIa, Ia
    treatment: Optional[str] = None
    is_fancy_color: bool = False
    fancy_color: Optional[str] = None
    fancy_intensity: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    notes: Optional[str] = None
    status: str = 'available'

class EnquiryIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: Optional[str] = None
    stone_ids: List[str] = []
    source: str = 'website'  # website | whatsapp

class RequestStoneIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    shape: Optional[str] = None
    carat_min: Optional[float] = None
    carat_max: Optional[float] = None
    color: Optional[str] = None
    clarity: Optional[str] = None
    budget: Optional[str] = None
    notes: Optional[str] = None

class NewsletterIn(BaseModel):
    email: EmailStr

# ---------------- Auth routes ----------------
@api_router.post('/auth/register')
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower()
    if await db.users.find_one({'email': email}):
        raise HTTPException(status_code=400, detail='Email already registered')
    user_doc = {
        'email': email, 'password_hash': hash_password(payload.password),
        'name': payload.name, 'company': payload.company, 'phone': payload.phone,
        'role': 'buyer', 'created_at': datetime.now(timezone.utc).isoformat()
    }
    result = await db.users.insert_one(user_doc)
    uid = str(result.inserted_id)
    token = create_access_token(uid, email, 'buyer')
    set_auth_cookies(response, token)
    return {'id': uid, 'email': email, 'name': payload.name, 'role': 'buyer', 'company': payload.company}

@api_router.post('/auth/login')
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({'email': email})
    if not user or not verify_password(payload.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    uid = str(user['_id'])
    token = create_access_token(uid, email, user['role'])
    set_auth_cookies(response, token)
    return {'id': uid, 'email': email, 'name': user.get('name'), 'role': user['role'], 'company': user.get('company')}

@api_router.post('/auth/logout')
async def logout(response: Response):
    response.delete_cookie('access_token', path='/')
    return {'message': 'logged out'}

@api_router.get('/auth/me')
async def me(user: dict = Depends(get_current_user)):
    return user

# ---------------- Diamond routes ----------------
@api_router.get('/diamonds')
async def list_diamonds(
    category: Optional[str] = None,
    shape: Optional[str] = None,
    color: Optional[str] = None,
    clarity: Optional[str] = None,
    certificate_lab: Optional[str] = None,
    fluorescence: Optional[str] = None,
    origin: Optional[str] = None,
    fancy_color: Optional[str] = None,
    fancy_intensity: Optional[str] = None,
    is_fancy_color: Optional[bool] = None,
    carat_min: Optional[float] = None,
    carat_max: Optional[float] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    search: Optional[str] = None,
    limit: int = 500
):
    q = {'status': {'$ne': 'archived'}}
    if category: q['category'] = category
    if shape: q['shape'] = shape.upper()
    if color: q['color'] = {'$regex': color, '$options': 'i'}
    if clarity: q['clarity'] = clarity
    if certificate_lab: q['certificate_lab'] = certificate_lab
    if fluorescence: q['fluorescence'] = fluorescence
    if origin: q['origin'] = origin
    if fancy_color: q['fancy_color'] = {'$regex': fancy_color, '$options': 'i'}
    if fancy_intensity: q['fancy_intensity'] = fancy_intensity
    if is_fancy_color is not None: q['is_fancy_color'] = is_fancy_color
    if carat_min is not None or carat_max is not None:
        q['carat'] = {}
        if carat_min is not None: q['carat']['$gte'] = carat_min
        if carat_max is not None: q['carat']['$lte'] = carat_max
    if price_min is not None or price_max is not None:
        q['total_price'] = {}
        if price_min is not None: q['total_price']['$gte'] = price_min
        if price_max is not None: q['total_price']['$lte'] = price_max
    if search:
        q['$or'] = [
            {'stock_id': {'$regex': search, '$options': 'i'}},
            {'certificate_number': {'$regex': search, '$options': 'i'}},
            {'color': {'$regex': search, '$options': 'i'}},
        ]
    docs = await db.diamonds.find(q).limit(limit).to_list(limit)
    for d in docs:
        d['id'] = str(d['_id'])
        del d['_id']
    return docs

@api_router.get('/diamonds/stats')
async def diamond_stats():
    total = await db.diamonds.count_documents({'status': {'$ne': 'archived'}})
    by_cat = {}
    for cat in ['cvd', 'natural', 'argyle_pink', 'argyle_blue']:
        by_cat[cat] = await db.diamonds.count_documents({'category': cat, 'status': {'$ne': 'archived'}})
    return {'total': total, 'by_category': by_cat}

@api_router.get('/diamonds/{diamond_id}')
async def get_diamond(diamond_id: str):
    d = await db.diamonds.find_one({'_id': ObjectId(diamond_id)})
    if not d: raise HTTPException(404, 'Not found')
    d['id'] = str(d['_id']); del d['_id']
    return d

@api_router.post('/diamonds')
async def create_diamond(payload: DiamondIn, _admin: dict = Depends(require_admin)):
    doc = payload.model_dump()
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.diamonds.insert_one(doc)
    doc.pop('_id', None)
    return {'id': str(result.inserted_id), **doc}

@api_router.put('/diamonds/{diamond_id}')
async def update_diamond(diamond_id: str, payload: DiamondIn, _admin: dict = Depends(require_admin)):
    doc = payload.model_dump()
    await db.diamonds.update_one({'_id': ObjectId(diamond_id)}, {'$set': doc})
    return {'id': diamond_id, **doc}

@api_router.delete('/diamonds/{diamond_id}')
async def delete_diamond(diamond_id: str, _admin: dict = Depends(require_admin)):
    await db.diamonds.update_one({'_id': ObjectId(diamond_id)}, {'$set': {'status': 'archived'}})
    return {'ok': True}

# ---------------- Enquiry routes ----------------
@api_router.post('/enquiries')
async def create_enquiry(payload: EnquiryIn):
    doc = payload.model_dump()
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['status'] = 'new'
    result = await db.enquiries.insert_one(doc)
    doc.pop('_id', None)
    return {'id': str(result.inserted_id), **doc}

@api_router.get('/enquiries')
async def list_enquiries(_admin: dict = Depends(require_admin)):
    docs = await db.enquiries.find({}).sort('created_at', -1).to_list(500)
    for d in docs:
        d['id'] = str(d['_id']); del d['_id']
    return docs

@api_router.post('/request-stone')
async def request_stone(payload: RequestStoneIn):
    doc = payload.model_dump()
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['type'] = 'stone_request'
    result = await db.requests.insert_one(doc)
    doc.pop('_id', None)
    return {'id': str(result.inserted_id), **doc}

@api_router.post('/newsletter')
async def newsletter(payload: NewsletterIn):
    email = payload.email.lower()
    await db.newsletter.update_one({'email': email},
                                    {'$set': {'email': email, 'subscribed_at': datetime.now(timezone.utc).isoformat()}},
                                    upsert=True)
    return {'ok': True}

# ---------------- Upload routes ----------------
@api_router.post('/uploads')
async def upload_file(file: UploadFile = File(...), folder: str = 'diamonds', _admin: dict = Depends(require_admin)):
    ext = (file.filename.rsplit('.', 1)[-1] if '.' in file.filename else 'bin').lower()
    fid = str(uuid.uuid4())
    path = f'{APP_NAME}/{folder}/{fid}.{ext}'
    data = await file.read()
    content_type = file.content_type or 'application/octet-stream'
    put_object(path, data, content_type)
    await db.files.insert_one({
        'storage_path': path, 'original_filename': file.filename,
        'content_type': content_type, 'size': len(data),
        'folder': folder, 'is_deleted': False,
        'created_at': datetime.now(timezone.utc).isoformat()
    })
    return {'storage_path': path, 'url': f'/api/files/{path}', 'content_type': content_type, 'size': len(data)}

@api_router.get('/files/{path:path}')
async def serve_file(path: str):
    rec = await db.files.find_one({'storage_path': path, 'is_deleted': False})
    if not rec:
        raise HTTPException(404, 'File not found')
    data, ct = get_object(path)
    return Response(content=data, media_type=rec.get('content_type', ct))

# ---------------- Seed ----------------
async def seed_admin():
    existing = await db.users.find_one({'email': ADMIN_EMAIL.lower()})
    if not existing:
        await db.users.insert_one({
            'email': ADMIN_EMAIL.lower(), 'password_hash': hash_password(ADMIN_PASSWORD),
            'name': 'Rainbow Star Admin', 'role': 'admin',
            'created_at': datetime.now(timezone.utc).isoformat()
        })
        logger.info('Admin seeded')
    elif not verify_password(ADMIN_PASSWORD, existing['password_hash']):
        await db.users.update_one({'email': ADMIN_EMAIL.lower()},
                                   {'$set': {'password_hash': hash_password(ADMIN_PASSWORD)}})

def _categorize(color: str, stock_id: str) -> tuple[str, bool, str, str]:
    """Returns (category, is_fancy, fancy_color, fancy_intensity)"""
    c = (color or '').upper()
    is_fancy = 'FANCY' in c or 'LIGHT' in c or 'FAINT' in c
    # Argyle Pink — all pink-family fancy colors
    if 'PINK' in c or 'PURPLISH' in c or 'PURPLE' in c:
        return ('argyle_pink', True, color, _intensity_from(c))
    # Argyle Blue — blue/violet/gray-blue
    if 'BLUE' in c or 'VIOLET' in c:
        return ('argyle_blue', True, color, _intensity_from(c))
    if is_fancy:
        return ('natural', True, color, _intensity_from(c))
    return ('natural', False, None, None)

def _intensity_from(c: str) -> str:
    for kw in ['VIVID', 'DEEP', 'INTENSE', 'DARK', 'FANCY LIGHT', 'LIGHT', 'FAINT', 'VERY LIGHT', 'FANCY']:
        if kw in c: return kw.title()
    return 'Fancy'

async def seed_diamonds():
    count = await db.diamonds.count_documents({})
    if count > 0:
        return
    # Natural fancy color diamonds extracted from inventory PDF
    natural_stones = [
        ('GHK3-1', 0.75, 'PEAR', 'Fancy Intense Purplish Pink', 'VS1', 10530, 7898, 'No Cert', None),
        ('KH1-1', 0.94, 'MARQUISE', 'O-P', 'VS2', 600, 564, 'GIA', '1234567001'),
        ('KH1-2', 0.36, 'PEAR', 'Fancy Light Gray', 'SI2', 738, 266, 'GIA', '1234567002'),
        ('KH1-10', 0.50, 'OVAL', 'Fancy Yellow', 'SI2', 2870, 1435, 'GIA', '1234567003'),
        ('KH1-102', 0.53, 'HEART', 'Fancy Brownish Orange', 'VS1', 3605, 1911, 'GIA', '1234567004'),
        ('KH1-105', 0.51, 'OVAL', 'Fancy Pink', 'SI1', 8280, 4223, 'GIA', '1234567005'),
        ('KH1-115', 1.00, 'CUSHION', 'Fancy Vivid Orangy Yellow', 'VS1', 18540, 18540, 'GIA', '1234567006'),
        ('KH1-116', 1.01, 'CUSHION', 'Fancy Vivid Orangy Yellow', 'VS1', 18540, 18725, 'GIA', '1234567007'),
        ('KH1-122', 1.01, 'OVAL', 'Fancy Deep Yellow', 'SI1', 5520, 5575, 'GIA', '1234567008'),
        ('KH1-126', 0.51, 'CUSHION', 'Fancy Intense Greenish Yellow', 'SI2', 3690, 1882, 'GIA', '1234567009'),
        ('KH1-136', 1.00, 'ROUND', 'Fancy Vivid Orange-Yellow', 'SI1', 13800, 13800, 'GIA', '1234567010'),
        ('KH1-138', 0.23, 'PEAR', 'Fancy Intense Pink', 'SI2', 14760, 3365, 'GIA', '1234567011'),
        ('KH1-150', 0.46, 'HEART', 'Fancy Light Gray-Blue', 'VS2', 6000, 2760, 'GIA', '1234567012'),
        ('KH1-160', 1.01, 'HEART', 'Fancy Intense Orangy Yellow', 'SI1', 6440, 6504, 'GIA', '1234567013'),
        ('KH1-165', 0.52, 'RADIANT', 'Fancy Deep Pink', 'SI2', 16400, 8462, 'GIA', '1234567014'),
        ('KH1-193', 0.41, 'PEAR', 'Fancy Vivid Purplish Pink', 'SI2', 45100, 18491, 'GIA', '1234567015'),
        ('KH1-210', 0.25, 'RADIANT', 'Fancy Vivid Greenish Yellow Orange', 'VS1', 12360, 3090, 'GIA', '1234567016'),
        ('KH1-215', 0.72, 'PEAR', 'Fancy Vivid Greenish Yellow-Orange', 'VS1', 14420, 10382, 'GIA', '1234567017'),
        ('KH1-238', 0.45, 'ROUND', 'Fancy Intense Yellowish Green', 'VS2', 8000, 3600, 'GIA', '1234567018'),
        ('KH1-247', 0.54, 'PEAR', 'Fancy Intense Yellow', 'VS1', 7725, 4172, 'GIA', '1234567019'),
        ('KH1-257', 0.35, 'RADIANT', 'Fancy Vivid Purplish Pink', 'SI2', 45100, 15785, 'GIA', '1234567020'),
        ('KH1-274', 0.68, 'HEART', 'Fancy Vivid Yellowish Orange', 'SI2', 16400, 11152, 'GIA', '1234567021'),
        ('KRMX6-6', 1.36, 'PEAR', 'Fancy Intense Green-Blue', 'I2', 4400, 5984, 'GIA', '1234567022'),
        ('KRMX6-8', 0.50, 'PEAR', 'Fancy Intense Green', 'VS2', 9000, 4500, 'GIA', '1234567023'),
        ('KRMX6-9', 0.42, 'PEAR', 'Fancy Greenish Blue', 'VS2', 12000, 5040, 'GIA', '1234567024'),
        ('KH1-181', 0.70, 'OVAL', 'Fancy Greenish Yellow', 'VS1', 4326, 3028, 'GIA', '1234567025'),
        ('KH1-182', 0.57, 'RADIANT', 'Fancy Yellow', 'VVS2', 6050, 3449, 'GIA', '1234567026'),
        ('KH1-204', 0.42, 'HEART', 'Fancy Intense Orangy Yellow', 'SI1', 5980, 2512, 'GIA', '1234567027'),
        ('KH1-205', 0.37, 'PEAR', 'Fancy Vivid Deep Brownish Orange-Yellow', 'VS1', 8240, 3049, 'GIA', '1234567028'),
        ('KH1-235', 0.77, 'PEAR', 'Fancy Intense Orange-Yellow', 'SI1', 5980, 4605, 'GIA', '1234567029'),
    ]
    # Argyle Pink stones (from Argyle valuation sheet)
    argyle_pink_stones = [
        ('GHK1-103', 0.30, 'PEAR', 'Fancy Light Pink', 'SI2', 5200, 1560),
        ('GHK1-104', 0.32, 'PEAR', 'Fancy Light Orangy Pink', 'VS2', 4200, 1344),
        ('GHK1-106', 0.28, 'PEAR', 'Fancy Orangy Pink', 'SI1', 6300, 1764),
        ('GHK1-108', 0.35, 'PEAR', 'Fancy Light Purplish Pink', 'SI2', 6800, 2380),
        ('GHK1-123', 0.40, 'RADIANT', 'Fancy Pink', 'VS', 9500, 3800),
        ('GHK1-126', 0.31, 'PRINCESS', 'Fancy Pink', 'SI1', 9200, 2852),
        ('GHK1-129', 0.27, 'CUSHION', 'Fancy Light Pink', 'SI1', 5100, 1377),
        ('GHK1-130', 0.38, 'MARQUISE', 'Fancy Purplish Pink', 'VS', 11500, 4370),
        ('GHK1-142', 0.45, 'CUSHION', 'Fancy Pink', 'I1', 6400, 2880),
        ('GHK1-144', 0.34, 'MARQUISE', 'Fancy Pink', 'VS2', 9100, 3094),
        ('GHK1-30', 0.50, 'ROUND', 'Fancy Pink', 'SI', 10200, 5100),
        ('GHK1-45', 0.42, 'ROUND', 'Fancy Intense Purple-Pink', 'VS', 24500, 10290),
        ('GHK1-89', 0.36, 'MARQUISE', 'Fancy Intense Purplish Pink', 'VS2', 22300, 8028),
        ('GHK1-90', 0.41, 'HEART', 'Fancy Purplish Pink', 'VS', 12400, 5084),
        ('GHK1-91', 0.39, 'CUSHION', 'Fancy Pink', 'VS2', 10100, 3939),
        ('GHK1-149', 0.33, 'HEART', 'Fancy Pink', 'VS', 9800, 3234),
        ('GHK1-37', 0.46, 'PEAR', 'Fancy Pink', 'VS', 10800, 4968),
        ('KH1-105b', 0.51, 'OVAL', 'Fancy Pink', 'SI1', 8280, 4223),
        ('KH1-206', 0.35, 'HEART', 'Fancy Pink', 'SI1', 8280, 2898),
        ('KH1-138b', 0.23, 'PEAR', 'Fancy Intense Pink', 'SI2', 14760, 3365),
        ('KH1-256', 0.08, 'PEAR', 'Fancy Vivid Purplish Pink', 'SI1', 36800, 2944),
        ('KH1-58b', 0.10, 'HEART', 'Fancy Pink', 'SI1', 7360, 736),
    ]
    # Argyle Blue stones (from Argyle valuation sheet)
    argyle_blue_stones = [
        ('GHK3-14', 0.25, 'ROUND', 'Light Grayish Blue', 'VS', 4500, 1125),
        ('GHK3-15', 0.30, 'MIX', 'Fancy Dark Bluish Gray', 'SI1', 3200, 960),
        ('GHK3-16', 0.22, 'ROUND', 'Light Bluish Gray', 'VS', 2800, 616),
        ('GHK3-17', 0.38, 'ROUND', 'Fancy Intense Grayish Blue', 'VS', 14500, 5510),
        ('GHK3-18', 0.28, 'MIX', 'Fancy Light Blue-Gray', 'VS', 4100, 1148),
        ('GHK3-19', 0.41, 'ROUND', 'Fancy Vivid Gray-Violet', 'VS', 22000, 9020),
        ('GHK3-20', 0.36, 'PEAR', 'Fancy Grayish Blue', 'VS', 12800, 4608),
        ('KH1-9', 0.12, 'CUSHION', 'Fancy Light Gray-Blue', 'SI1', 5060, 607),
        ('KH1-153', 0.40, 'PEAR', 'Fancy Light Gray-Blue', 'SI1', 5060, 2024),
        ('KH1-154', 0.27, 'CUSHION', 'Fancy Light Gray-Blue', 'VS2', 6000, 1620),
        ('KH1-7b', 0.08, 'HEART', 'Fancy Grayish Blue', 'SI2', 4100, 328),
        ('KH1-188', 0.62, 'OVAL', 'Fancy Grayish Blue-Yellow', 'VS2', 5000, 3100),
    ]
    # CVD Lab grown diamonds (generated realistic stock)
    cvd_stones = [
        ('CVD-001', 1.01, 'ROUND', 'D', 'VVS1', 1850, 1869, 'IGI'),
        ('CVD-002', 1.50, 'ROUND', 'E', 'VS1', 1620, 2430, 'IGI'),
        ('CVD-003', 2.00, 'ROUND', 'F', 'VS2', 1450, 2900, 'IGI'),
        ('CVD-004', 0.75, 'OVAL', 'D', 'VVS2', 1700, 1275, 'IGI'),
        ('CVD-005', 1.25, 'CUSHION', 'E', 'VS1', 1580, 1975, 'IGI'),
        ('CVD-006', 1.00, 'PRINCESS', 'F', 'VS2', 1390, 1390, 'GIA'),
        ('CVD-007', 1.75, 'EMERALD', 'G', 'VS1', 1500, 2625, 'IGI'),
        ('CVD-008', 2.50, 'ROUND', 'D', 'VVS1', 2100, 5250, 'IGI'),
        ('CVD-009', 1.10, 'PEAR', 'E', 'VS2', 1480, 1628, 'GIA'),
        ('CVD-010', 0.90, 'RADIANT', 'F', 'VS1', 1520, 1368, 'IGI'),
        ('CVD-011', 3.00, 'ROUND', 'G', 'VS2', 1850, 5550, 'IGI'),
        ('CVD-012', 1.20, 'MARQUISE', 'D', 'VVS2', 1680, 2016, 'GIA'),
        ('CVD-013', 1.55, 'ASSCHER', 'E', 'VS1', 1620, 2511, 'IGI'),
        ('CVD-014', 0.85, 'HEART', 'F', 'SI1', 1280, 1088, 'IGI'),
        ('CVD-015', 2.20, 'OVAL', 'G', 'VS2', 1450, 3190, 'IGI'),
        ('CVD-016', 1.00, 'ROUND', 'D', 'IF', 2300, 2300, 'GIA'),
        ('CVD-017', 1.30, 'CUSHION', 'F', 'VVS2', 1700, 2210, 'IGI'),
        ('CVD-018', 0.70, 'PEAR', 'E', 'VS1', 1450, 1015, 'IGI'),
        ('CVD-019', 4.05, 'ROUND', 'F', 'VS1', 2500, 10125, 'IGI'),
        ('CVD-020', 1.45, 'EMERALD', 'D', 'VVS1', 1900, 2755, 'GIA'),
        ('CVD-021', 0.55, 'ROUND', 'G', 'VS2', 1180, 649, 'IGI'),
        ('CVD-022', 2.75, 'OVAL', 'E', 'VS1', 1850, 5087, 'IGI'),
        ('CVD-023', 1.65, 'RADIANT', 'F', 'VS2', 1520, 2508, 'IGI'),
        ('CVD-024', 1.05, 'PRINCESS', 'D', 'VVS2', 1750, 1837, 'GIA'),
        ('CVD-025', 0.80, 'HEART', 'E', 'VS1', 1380, 1104, 'IGI'),
    ]

    docs = []
    cuts = ['Excellent', 'Very Good', 'Good']
    fluo = ['None', 'Faint', 'Medium']
    now = datetime.now(timezone.utc).isoformat()

    # Natural fancy
    for i, (sid, ct, shape, color, clarity, ppc, total, lab, cert_no) in enumerate(natural_stones):
        cat, fancy, fc, fi = _categorize(color, sid)
        docs.append({
            'stock_id': sid, 'category': cat, 'shape': shape, 'carat': ct, 'color': color,
            'clarity': clarity, 'cut': cuts[i % 3], 'polish': 'Excellent', 'symmetry': 'Very Good',
            'fluorescence': fluo[i % 3], 'certificate_lab': lab, 'certificate_number': cert_no,
            'certificate_url': None, 'price_per_carat': ppc, 'total_price': total,
            'origin': 'India', 'diamond_type': 'IIa' if i % 4 == 0 else 'Ia', 'treatment': 'None',
            'is_fancy_color': fancy, 'fancy_color': fc, 'fancy_intensity': fi,
            'image_url': None, 'video_url': None, 'notes': None, 'status': 'available',
            'created_at': now
        })

    # Argyle Pink
    for i, (sid, ct, shape, color, clarity, ppc, total) in enumerate(argyle_pink_stones):
        docs.append({
            'stock_id': sid, 'category': 'argyle_pink', 'shape': shape, 'carat': ct, 'color': color,
            'clarity': clarity, 'cut': cuts[i % 3], 'polish': 'Excellent', 'symmetry': 'Excellent',
            'fluorescence': 'None', 'certificate_lab': 'GIA Fancy Color',
            'certificate_number': f'ARG-P-{1000 + i}', 'certificate_url': None,
            'price_per_carat': ppc, 'total_price': total,
            'origin': 'Argyle — Australia', 'diamond_type': 'Ia', 'treatment': 'None',
            'is_fancy_color': True, 'fancy_color': color, 'fancy_intensity': _intensity_from(color.upper()),
            'image_url': None, 'video_url': None, 'notes': 'Argyle Mine — Tier 1',
            'status': 'available', 'created_at': now
        })

    # Argyle Blue
    for i, (sid, ct, shape, color, clarity, ppc, total) in enumerate(argyle_blue_stones):
        docs.append({
            'stock_id': sid, 'category': 'argyle_blue', 'shape': shape, 'carat': ct, 'color': color,
            'clarity': clarity, 'cut': cuts[i % 3], 'polish': 'Excellent', 'symmetry': 'Very Good',
            'fluorescence': 'None', 'certificate_lab': 'GIA Fancy Color',
            'certificate_number': f'ARG-B-{2000 + i}', 'certificate_url': None,
            'price_per_carat': ppc, 'total_price': total,
            'origin': 'Argyle — Australia', 'diamond_type': 'IIb', 'treatment': 'None',
            'is_fancy_color': True, 'fancy_color': color, 'fancy_intensity': _intensity_from(color.upper()),
            'image_url': None, 'video_url': None, 'notes': 'Argyle Mine — Rare Blue',
            'status': 'available', 'created_at': now
        })

    # CVD
    for i, (sid, ct, shape, color, clarity, ppc, total, lab) in enumerate(cvd_stones):
        docs.append({
            'stock_id': sid, 'category': 'cvd', 'shape': shape, 'carat': ct, 'color': color,
            'clarity': clarity, 'cut': 'Excellent', 'polish': 'Excellent', 'symmetry': 'Excellent',
            'fluorescence': fluo[i % 3], 'certificate_lab': lab,
            'certificate_number': f'LG{500000 + i}', 'certificate_url': None,
            'price_per_carat': ppc, 'total_price': total,
            'origin': 'Lab Grown', 'diamond_type': 'IIa', 'treatment': 'CVD',
            'is_fancy_color': False, 'fancy_color': None, 'fancy_intensity': None,
            'image_url': None, 'video_url': None, 'notes': None,
            'status': 'available', 'created_at': now
        })

    if docs:
        await db.diamonds.insert_many(docs)
        logger.info(f'Seeded {len(docs)} diamonds')

@app.on_event('startup')
async def on_startup():
    await db.users.create_index('email', unique=True)
    await db.diamonds.create_index('stock_id')
    await db.diamonds.create_index('category')
    await seed_admin()
    await seed_diamonds()
    init_storage()
    logger.info('Rainbow Star backend ready')

@app.on_event('shutdown')
async def on_shutdown():
    client.close()

# ---------------- Root ----------------
@api_router.get('/')
async def root():
    return {'app': 'Rainbow Star', 'status': 'ok'}

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)
