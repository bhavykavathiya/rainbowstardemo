/*
# Seed Diamond Inventory

Populates the diamonds table with the full Rainbow Star inventory:
- 29 Natural Fancy Color diamonds (GIA certified)
- 22 Argyle Pink diamonds (single stones + parcels)
- 12 Argyle Blue diamonds (single stones + parcels)
- 25 CVD Lab-Grown diamonds (IGI/GIA certified)

Total: 88 diamonds. This is a data-only migration (no schema changes).
*/

DO $$
DECLARE
  now_ts timestamptz := now();
BEGIN
  -- Only seed if table is empty
  IF (SELECT COUNT(*) FROM diamonds) > 0 THEN RETURN; END IF;

  -- ===== NATURAL FANCY COLOR =====
  INSERT INTO diamonds (stock_id, category, shape, carat, color, clarity, cut, polish, symmetry, fluorescence, certificate_lab, certificate_number, price_per_carat, total_price, origin, diamond_type, treatment, is_fancy_color, fancy_color, fancy_intensity, status, created_at) VALUES
  ('GHK3-1','natural','PEAR',0.75,'Fancy Intense Purplish Pink','VS1','Excellent','Excellent','Very Good','None','No Cert',NULL,10530,7898,'India','IIa','None',true,'Fancy Intense Purplish Pink','Intense','available',now_ts),
  ('KH1-1','natural','MARQUISE',0.94,'O-P','VS2','Very Good','Excellent','Very Good','Faint','GIA','1234567001',600,564,'India','Ia','None',false,NULL,NULL,'available',now_ts),
  ('KH1-2','natural','PEAR',0.36,'Fancy Light Gray','SI2','Good','Excellent','Very Good','Medium','GIA','1234567002',738,266,'India','Ia','None',true,'Fancy Light Gray','Light','available',now_ts),
  ('KH1-10','natural','OVAL',0.50,'Fancy Yellow','SI2','Excellent','Excellent','Very Good','None','GIA','1234567003',2870,1435,'India','Ia','None',true,'Fancy Yellow','Fancy','available',now_ts),
  ('KH1-102','natural','HEART',0.53,'Fancy Brownish Orange','VS1','Very Good','Excellent','Very Good','Faint','GIA','1234567004',3605,1911,'India','IIa','None',true,'Fancy Brownish Orange','Fancy','available',now_ts),
  ('KH1-105','natural','OVAL',0.51,'Fancy Pink','SI1','Good','Excellent','Very Good','Medium','GIA','1234567005',8280,4223,'India','Ia','None',true,'Fancy Pink','Fancy','available',now_ts),
  ('KH1-115','natural','CUSHION',1.00,'Fancy Vivid Orangy Yellow','VS1','Excellent','Excellent','Very Good','None','GIA','1234567006',18540,18540,'India','IIa','None',true,'Fancy Vivid Orangy Yellow','Vivid','available',now_ts),
  ('KH1-116','natural','CUSHION',1.01,'Fancy Vivid Orangy Yellow','VS1','Very Good','Excellent','Very Good','Faint','GIA','1234567007',18540,18725,'India','Ia','None',true,'Fancy Vivid Orangy Yellow','Vivid','available',now_ts),
  ('KH1-122','natural','OVAL',1.01,'Fancy Deep Yellow','SI1','Good','Excellent','Very Good','Medium','GIA','1234567008',5520,5575,'India','Ia','None',true,'Fancy Deep Yellow','Deep','available',now_ts),
  ('KH1-126','natural','CUSHION',0.51,'Fancy Intense Greenish Yellow','SI2','Excellent','Excellent','Very Good','None','GIA','1234567009',3690,1882,'India','IIa','None',true,'Fancy Intense Greenish Yellow','Intense','available',now_ts),
  ('KH1-136','natural','ROUND',1.00,'Fancy Vivid Orange-Yellow','SI1','Very Good','Excellent','Very Good','Faint','GIA','1234567010',13800,13800,'India','Ia','None',true,'Fancy Vivid Orange-Yellow','Vivid','available',now_ts),
  ('KH1-138','natural','PEAR',0.23,'Fancy Intense Pink','SI2','Good','Excellent','Very Good','Medium','GIA','1234567011',14760,3365,'India','Ia','None',true,'Fancy Intense Pink','Intense','available',now_ts),
  ('KH1-150','natural','HEART',0.46,'Fancy Light Gray-Blue','VS2','Excellent','Excellent','Very Good','None','GIA','1234567012',6000,2760,'India','Ia','None',true,'Fancy Light Gray-Blue','Light','available',now_ts),
  ('KH1-160','natural','HEART',1.01,'Fancy Intense Orangy Yellow','SI1','Very Good','Excellent','Very Good','Faint','GIA','1234567013',6440,6504,'India','IIa','None',true,'Fancy Intense Orangy Yellow','Intense','available',now_ts),
  ('KH1-165','natural','RADIANT',0.52,'Fancy Deep Pink','SI2','Good','Excellent','Very Good','Medium','GIA','1234567014',16400,8462,'India','Ia','None',true,'Fancy Deep Pink','Deep','available',now_ts),
  ('KH1-193','natural','PEAR',0.41,'Fancy Vivid Purplish Pink','SI2','Excellent','Excellent','Very Good','None','GIA','1234567015',45100,18491,'India','IIa','None',true,'Fancy Vivid Purplish Pink','Vivid','available',now_ts),
  ('KH1-210','natural','RADIANT',0.25,'Fancy Vivid Greenish Yellow Orange','VS1','Very Good','Excellent','Very Good','Faint','GIA','1234567016',12360,3090,'India','Ia','None',true,'Fancy Vivid Greenish Yellow Orange','Vivid','available',now_ts),
  ('KH1-215','natural','PEAR',0.72,'Fancy Vivid Greenish Yellow-Orange','VS1','Good','Excellent','Very Good','Medium','GIA','1234567017',14420,10382,'India','Ia','None',true,'Fancy Vivid Greenish Yellow-Orange','Vivid','available',now_ts),
  ('KH1-238','natural','ROUND',0.45,'Fancy Intense Yellowish Green','VS2','Excellent','Excellent','Very Good','None','GIA','1234567018',8000,3600,'India','IIa','None',true,'Fancy Intense Yellowish Green','Intense','available',now_ts),
  ('KH1-247','natural','PEAR',0.54,'Fancy Intense Yellow','VS1','Very Good','Excellent','Very Good','Faint','GIA','1234567019',7725,4172,'India','Ia','None',true,'Fancy Intense Yellow','Intense','available',now_ts),
  ('KH1-257','natural','RADIANT',0.35,'Fancy Vivid Purplish Pink','SI2','Good','Excellent','Very Good','Medium','GIA','1234567020',45100,15785,'India','Ia','None',true,'Fancy Vivid Purplish Pink','Vivid','available',now_ts),
  ('KH1-274','natural','HEART',0.68,'Fancy Vivid Yellowish Orange','SI2','Excellent','Excellent','Very Good','None','GIA','1234567021',16400,11152,'India','IIa','None',true,'Fancy Vivid Yellowish Orange','Vivid','available',now_ts),
  ('KRMX6-6','natural','PEAR',1.36,'Fancy Intense Green-Blue','I2','Very Good','Excellent','Very Good','Faint','GIA','1234567022',4400,5984,'India','Ia','None',true,'Fancy Intense Green-Blue','Intense','available',now_ts),
  ('KRMX6-8','natural','PEAR',0.50,'Fancy Intense Green','VS2','Good','Excellent','Very Good','Medium','GIA','1234567023',9000,4500,'India','IIa','None',true,'Fancy Intense Green','Intense','available',now_ts),
  ('KRMX6-9','natural','PEAR',0.42,'Fancy Greenish Blue','VS2','Excellent','Excellent','Very Good','None','GIA','1234567024',12000,5040,'India','Ia','None',true,'Fancy Greenish Blue','Fancy','available',now_ts),
  ('KH1-181','natural','OVAL',0.70,'Fancy Greenish Yellow','VS1','Very Good','Excellent','Very Good','Faint','GIA','1234567025',4326,3028,'India','Ia','None',true,'Fancy Greenish Yellow','Fancy','available',now_ts),
  ('KH1-182','natural','RADIANT',0.57,'Fancy Yellow','VVS2','Good','Excellent','Very Good','Medium','GIA','1234567026',6050,3449,'India','IIa','None',true,'Fancy Yellow','Fancy','available',now_ts),
  ('KH1-204','natural','HEART',0.42,'Fancy Intense Orangy Yellow','SI1','Excellent','Excellent','Very Good','None','GIA','1234567027',5980,2512,'India','Ia','None',true,'Fancy Intense Orangy Yellow','Intense','available',now_ts),
  ('KH1-205','natural','PEAR',0.37,'Fancy Vivid Deep Brownish Orange-Yellow','VS1','Very Good','Excellent','Very Good','Faint','GIA','1234567028',8240,3049,'India','Ia','None',true,'Fancy Vivid Deep Brownish Orange-Yellow','Vivid','available',now_ts),
  ('KH1-235','natural','PEAR',0.77,'Fancy Intense Orange-Yellow','SI1','Good','Excellent','Very Good','Medium','GIA','1234567029',5980,4605,'India','IIa','None',true,'Fancy Intense Orange-Yellow','Intense','available',now_ts);

  -- ===== ARGYLE PINK (first 6 single, rest parcels) =====
  INSERT INTO diamonds (stock_id, category, shape, carat, color, clarity, cut, polish, symmetry, fluorescence, certificate_lab, certificate_number, price_per_carat, total_price, origin, diamond_type, treatment, is_fancy_color, fancy_color, fancy_intensity, notes, status, parcel_type, parcel_pieces, parcel_total_carat, created_at) VALUES
  ('GHK1-103','argyle_pink','PEAR',0.30,'Fancy Light Pink','SI2','Excellent','Excellent','Excellent','None','GIA Fancy Color','ARG-P-1000',5200,1560,'Argyle — Australia','Ia','None',true,'Fancy Light Pink','Light','Argyle Mine — Tier 1','available','single',NULL,NULL,now_ts),
  ('GHK1-104','argyle_pink','PEAR',0.32,'Fancy Light Orangy Pink','VS2','Very Good','Excellent','Excellent','None','GIA Fancy Color','ARG-P-1001',4200,1344,'Argyle — Australia','Ia','None',true,'Fancy Light Orangy Pink','Light','Argyle Mine — Tier 1','available','single',NULL,NULL,now_ts),
  ('GHK1-106','argyle_pink','PEAR',0.28,'Fancy Orangy Pink','SI1','Good','Excellent','Excellent','None','GIA Fancy Color','ARG-P-1002',6300,1764,'Argyle — Australia','Ia','None',true,'Fancy Orangy Pink','Fancy','Argyle Mine — Tier 1','available','single',NULL,NULL,now_ts),
  ('GHK1-108','argyle_pink','PEAR',0.35,'Fancy Light Purplish Pink','SI2','Excellent','Excellent','Excellent','None','GIA Fancy Color','ARG-P-1003',6800,2380,'Argyle — Australia','Ia','None',true,'Fancy Light Purplish Pink','Light','Argyle Mine — Tier 1','available','single',NULL,NULL,now_ts),
  ('GHK1-123','argyle_pink','RADIANT',0.40,'Fancy Pink','VS','Very Good','Excellent','Excellent','None','GIA Fancy Color','ARG-P-1004',9500,3800,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Argyle Mine — Tier 1','available','single',NULL,NULL,now_ts),
  ('GHK1-126','argyle_pink','PRINCESS',0.31,'Fancy Pink','SI1','Good','Excellent','Excellent','None','GIA Fancy Color','ARG-P-1005',9200,2852,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Argyle Mine — Tier 1','available','single',NULL,NULL,now_ts),
  ('GHK1-129','argyle_pink','CUSHION',0.27,'Fancy Light Pink','SI1','Excellent','Excellent','Excellent','None',NULL,NULL,5100,11605,'Argyle — Australia','Ia','None',true,'Fancy Light Pink','Light','Parcel lot — 29 pcs, mixed sizes','available','parcel',29,7.83,now_ts),
  ('GHK1-130','argyle_pink','MARQUISE',0.38,'Fancy Purplish Pink','VS','Very Good','Excellent','Excellent','None',NULL,NULL,11500,37068,'Argyle — Australia','Ia','None',true,'Fancy Purplish Pink','Fancy','Parcel lot — 30 pcs, mixed sizes','available','parcel',30,11.40,now_ts),
  ('GHK1-142','argyle_pink','CUSHION',0.45,'Fancy Pink','I1','Good','Excellent','Excellent','None',NULL,NULL,6400,24480,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 31 pcs, mixed sizes','available','parcel',31,13.95,now_ts),
  ('GHK1-144','argyle_pink','MARQUISE',0.34,'Fancy Pink','VS2','Excellent','Excellent','Excellent','None',NULL,NULL,9100,23281,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 32 pcs, mixed sizes','available','parcel',32,10.88,now_ts),
  ('GHK1-30','argyle_pink','ROUND',0.50,'Fancy Pink','SI','Very Good','Excellent','Excellent','None',NULL,NULL,10200,43350,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 33 pcs, mixed sizes','available','parcel',33,16.50,now_ts),
  ('GHK1-45','argyle_pink','ROUND',0.42,'Fancy Intense Purple-Pink','VS','Good','Excellent','Excellent','None',NULL,NULL,24500,87413,'Argyle — Australia','Ia','None',true,'Fancy Intense Purple-Pink','Intense','Parcel lot — 34 pcs, mixed sizes','available','parcel',34,14.28,now_ts),
  ('GHK1-89','argyle_pink','MARQUISE',0.36,'Fancy Intense Purplish Pink','VS2','Excellent','Excellent','Excellent','None',NULL,NULL,22300,68176,'Argyle — Australia','Ia','None',true,'Fancy Intense Purplish Pink','Intense','Parcel lot — 35 pcs, mixed sizes','available','parcel',35,12.60,now_ts),
  ('GHK1-90','argyle_pink','HEART',0.41,'Fancy Purplish Pink','VS','Very Good','Excellent','Excellent','None',NULL,NULL,12400,43140,'Argyle — Australia','Ia','None',true,'Fancy Purplish Pink','Fancy','Parcel lot — 36 pcs, mixed sizes','available','parcel',36,14.76,now_ts),
  ('GHK1-91','argyle_pink','CUSHION',0.39,'Fancy Pink','VS2','Good','Excellent','Excellent','None',NULL,NULL,10100,33583,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 37 pcs, mixed sizes','available','parcel',37,14.43,now_ts),
  ('GHK1-149','argyle_pink','HEART',0.33,'Fancy Pink','VS','Excellent','Excellent','Excellent','None',NULL,NULL,9800,27489,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 38 pcs, mixed sizes','available','parcel',38,12.54,now_ts),
  ('GHK1-37','argyle_pink','PEAR',0.46,'Fancy Pink','VS','Very Good','Excellent','Excellent','None',NULL,NULL,10800,42120,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 39 pcs, mixed sizes','available','parcel',39,17.94,now_ts),
  ('KH1-105b','argyle_pink','OVAL',0.51,'Fancy Pink','SI1','Good','Excellent','Excellent','None',NULL,NULL,8280,35808,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 40 pcs, mixed sizes','available','parcel',40,20.40,now_ts),
  ('KH1-206','argyle_pink','HEART',0.35,'Fancy Pink','SI1','Excellent','Excellent','Excellent','None',NULL,NULL,8280,24840,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 28 pcs, mixed sizes','available','parcel',28,9.80,now_ts),
  ('KH1-138b','argyle_pink','PEAR',0.23,'Fancy Intense Pink','SI2','Very Good','Excellent','Excellent','None',NULL,NULL,14760,28626,'Argyle — Australia','Ia','None',true,'Fancy Intense Pink','Intense','Parcel lot — 29 pcs, mixed sizes','available','parcel',29,6.67,now_ts),
  ('KH1-256','argyle_pink','PEAR',0.08,'Fancy Vivid Purplish Pink','SI1','Good','Excellent','Excellent','None',NULL,NULL,36800,24960,'Argyle — Australia','Ia','None',true,'Fancy Vivid Purplish Pink','Vivid','Parcel lot — 30 pcs, mixed sizes','available','parcel',30,2.40,now_ts),
  ('KH1-58b','argyle_pink','HEART',0.10,'Fancy Pink','SI1','Excellent','Excellent','Excellent','None',NULL,NULL,7360,6256,'Argyle — Australia','Ia','None',true,'Fancy Pink','Fancy','Parcel lot — 31 pcs, mixed sizes','available','parcel',31,3.10,now_ts);

  -- ===== ARGYLE BLUE (first 4 single, rest parcels) =====
  INSERT INTO diamonds (stock_id, category, shape, carat, color, clarity, cut, polish, symmetry, fluorescence, certificate_lab, certificate_number, price_per_carat, total_price, origin, diamond_type, treatment, is_fancy_color, fancy_color, fancy_intensity, notes, status, parcel_type, parcel_pieces, parcel_total_carat, created_at) VALUES
  ('GHK3-14','argyle_blue','ROUND',0.25,'Light Grayish Blue','VS','Excellent','Excellent','Very Good','None','GIA Fancy Color','ARG-B-2000',4500,1125,'Argyle — Australia','IIb','None',true,'Light Grayish Blue','Light','Argyle Mine — Rare Blue','available','single',NULL,NULL,now_ts),
  ('GHK3-15','argyle_blue','MIX',0.30,'Fancy Dark Bluish Gray','SI1','Very Good','Excellent','Very Good','None','GIA Fancy Color','ARG-B-2001',3200,960,'Argyle — Australia','IIb','None',true,'Fancy Dark Bluish Gray','Dark','Argyle Mine — Rare Blue','available','single',NULL,NULL,now_ts),
  ('GHK3-16','argyle_blue','ROUND',0.22,'Light Bluish Gray','VS','Good','Excellent','Very Good','None','GIA Fancy Color','ARG-B-2002',2800,616,'Argyle — Australia','IIb','None',true,'Light Bluish Gray','Light','Argyle Mine — Rare Blue','available','single',NULL,NULL,now_ts),
  ('GHK3-17','argyle_blue','ROUND',0.38,'Fancy Intense Grayish Blue','VS','Excellent','Excellent','Very Good','None','GIA Fancy Color','ARG-B-2003',14500,5510,'Argyle — Australia','IIb','None',true,'Fancy Intense Grayish Blue','Intense','Argyle Mine — Rare Blue','available','single',NULL,NULL,now_ts),
  ('GHK3-18','argyle_blue','MIX',0.28,'Fancy Light Blue-Gray','VS','Very Good','Excellent','Very Good','None',NULL,NULL,4100,9756,'Argyle — Australia','IIb','None',true,'Fancy Light Blue-Gray','Light','Parcel lot — 32 pcs, mixed sizes','available','parcel',32,8.96,now_ts),
  ('GHK3-19','argyle_blue','ROUND',0.41,'Fancy Vivid Gray-Violet','VS','Good','Excellent','Very Good','None',NULL,NULL,22000,74860,'Argyle — Australia','IIb','None',true,'Fancy Vivid Gray-Violet','Vivid','Parcel lot — 34 pcs, mixed sizes','available','parcel',34,13.94,now_ts),
  ('GHK3-20','argyle_blue','PEAR',0.36,'Fancy Grayish Blue','VS','Excellent','Excellent','Very Good','None',NULL,NULL,12800,39168,'Argyle — Australia','IIb','None',true,'Fancy Grayish Blue','Fancy','Parcel lot — 36 pcs, mixed sizes','available','parcel',36,12.96,now_ts),
  ('KH1-9','argyle_blue','CUSHION',0.12,'Fancy Light Gray-Blue','SI1','Very Good','Excellent','Very Good','None',NULL,NULL,5060,5161,'Argyle — Australia','IIb','None',true,'Fancy Light Gray-Blue','Light','Parcel lot — 38 pcs, mixed sizes','available','parcel',38,4.56,now_ts),
  ('KH1-153','argyle_blue','PEAR',0.40,'Fancy Light Gray-Blue','SI1','Good','Excellent','Very Good','None',NULL,NULL,5060,17204,'Argyle — Australia','IIb','None',true,'Fancy Light Gray-Blue','Light','Parcel lot — 40 pcs, mixed sizes','available','parcel',40,16.00,now_ts),
  ('KH1-154','argyle_blue','CUSHION',0.27,'Fancy Light Gray-Blue','VS2','Excellent','Excellent','Very Good','None',NULL,NULL,6000,13770,'Argyle — Australia','IIb','None',true,'Fancy Light Gray-Blue','Light','Parcel lot — 32 pcs, mixed sizes','available','parcel',32,8.64,now_ts),
  ('KH1-7b','argyle_blue','HEART',0.08,'Fancy Grayish Blue','SI2','Very Good','Excellent','Very Good','None',NULL,NULL,4100,1115,'Argyle — Australia','IIb','None',true,'Fancy Grayish Blue','Fancy','Parcel lot — 34 pcs, mixed sizes','available','parcel',34,2.72,now_ts),
  ('KH1-188','argyle_blue','OVAL',0.62,'Fancy Grayish Blue-Yellow','VS2','Good','Excellent','Very Good','None',NULL,NULL,5000,10540,'Argyle — Australia','IIb','None',true,'Fancy Grayish Blue-Yellow','Fancy','Parcel lot — 36 pcs, mixed sizes','available','parcel',36,22.32,now_ts);

  -- ===== CVD LAB-GROWN =====
  INSERT INTO diamonds (stock_id, category, shape, carat, color, clarity, cut, polish, symmetry, fluorescence, certificate_lab, certificate_number, price_per_carat, total_price, origin, diamond_type, treatment, is_fancy_color, status, created_at) VALUES
  ('CVD-001','cvd','ROUND',1.01,'D','VVS1','Excellent','Excellent','Excellent','None','IGI','LG500000',1850,1869,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-002','cvd','ROUND',1.50,'E','VS1','Excellent','Excellent','Excellent','Faint','IGI','LG500001',1620,2430,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-003','cvd','ROUND',2.00,'F','VS2','Excellent','Excellent','Excellent','Medium','IGI','LG500002',1450,2900,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-004','cvd','OVAL',0.75,'D','VVS2','Excellent','Excellent','Excellent','None','IGI','LG500003',1700,1275,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-005','cvd','CUSHION',1.25,'E','VS1','Excellent','Excellent','Excellent','Faint','IGI','LG500004',1580,1975,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-006','cvd','PRINCESS',1.00,'F','VS2','Excellent','Excellent','Excellent','Medium','GIA','LG500005',1390,1390,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-007','cvd','EMERALD',1.75,'G','VS1','Excellent','Excellent','Excellent','None','IGI','LG500006',1500,2625,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-008','cvd','ROUND',2.50,'D','VVS1','Excellent','Excellent','Excellent','Faint','IGI','LG500007',2100,5250,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-009','cvd','PEAR',1.10,'E','VS2','Excellent','Excellent','Excellent','Medium','GIA','LG500008',1480,1628,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-010','cvd','RADIANT',0.90,'F','VS1','Excellent','Excellent','Excellent','None','IGI','LG500009',1520,1368,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-011','cvd','ROUND',3.00,'G','VS2','Excellent','Excellent','Excellent','Faint','IGI','LG500010',1850,5550,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-012','cvd','MARQUISE',1.20,'D','VVS2','Excellent','Excellent','Excellent','Medium','GIA','LG500011',1680,2016,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-013','cvd','ASSCHER',1.55,'E','VS1','Excellent','Excellent','Excellent','None','IGI','LG500012',1620,2511,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-014','cvd','HEART',0.85,'F','SI1','Excellent','Excellent','Excellent','Faint','IGI','LG500013',1280,1088,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-015','cvd','OVAL',2.20,'G','VS2','Excellent','Excellent','Excellent','Medium','IGI','LG500014',1450,3190,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-016','cvd','ROUND',1.00,'D','IF','Excellent','Excellent','Excellent','None','GIA','LG500015',2300,2300,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-017','cvd','CUSHION',1.30,'F','VVS2','Excellent','Excellent','Excellent','Faint','IGI','LG500016',1700,2210,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-018','cvd','PEAR',0.70,'E','VS1','Excellent','Excellent','Excellent','Medium','IGI','LG500017',1450,1015,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-019','cvd','ROUND',4.05,'F','VS1','Excellent','Excellent','Excellent','None','IGI','LG500018',2500,10125,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-020','cvd','EMERALD',1.45,'D','VVS1','Excellent','Excellent','Excellent','Faint','GIA','LG500019',1900,2755,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-021','cvd','ROUND',0.55,'G','VS2','Excellent','Excellent','Excellent','Medium','IGI','LG500020',1180,649,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-022','cvd','OVAL',2.75,'E','VS1','Excellent','Excellent','Excellent','None','IGI','LG500021',1850,5087,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-023','cvd','RADIANT',1.65,'F','VS2','Excellent','Excellent','Excellent','Faint','IGI','LG500022',1520,2508,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-024','cvd','PRINCESS',1.05,'D','VVS2','Excellent','Excellent','Excellent','Medium','GIA','LG500023',1750,1837,'Lab Grown','IIa','CVD',false,'available',now_ts),
  ('CVD-025','cvd','HEART',0.80,'E','VS1','Excellent','Excellent','Excellent','None','IGI','LG500024',1380,1104,'Lab Grown','IIa','CVD',false,'available',now_ts);

END $$;
