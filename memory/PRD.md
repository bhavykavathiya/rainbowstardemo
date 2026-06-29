# Rainbow Star — PRD

## Original Problem Statement
Premium B2B loose diamond stock showcase website for rainbowstar.in.
Sections: CVD Diamonds (Lab Grown), Natural Diamonds (White, Fancy Color, Argyle Pink, Argyle Blue).
Buyer + Admin login, WhatsApp enquiry, object storage for diamond images/videos/cert PDFs.
Warm gold/yellow tone preferred (matching rainbowstar.in style).

## User Personas
- Jewelers, dealers, wholesalers, retailers (buyers — browse, enquire, request stones)
- Admin / trade desk (Jayesh Kavathiya's team — manage inventory, view enquiries)

## Tech Stack
- Backend: FastAPI + MongoDB (motor), JWT auth (httpOnly cookies + bearer fallback)
- Frontend: React 19 + React Router 7 + Framer Motion + Tailwind + shadcn primitives
- Storage: Emergent Object Storage (proxied via /api/files/* — uploaded by admin)
- Theme: Warm dark (#14110A bg), Gold (#E5C158), Rose Gold (#C68997), Electric Blue (#6DD0F8)
- Fonts: Cormorant Garamond (serif/headings), Montserrat (body)

## What's Implemented (Feb 2026)
- Homepage: hero with diamond-dust particles, animated "Rainbow Star" refraction text, live stock counter, trust badges, 6 quick navigation tiles, featured stones carousel, newsletter signup
- Stock pages: CVD, Natural, Argyle Pink (rose-gold glow), Argyle Blue (electric-blue glow) — each with filter panel (Shape, Carat range, Color, Clarity, Cut/Polish/Symmetry, Fluorescence, Certificate, Origin, Price), Grid + Table toggle, search by stock ID
- Stone cards: Stock ID, key specs, $/ct, total $, "+ Enquiry" + WhatsApp buttons, cert link
- Enquiry basket: floating FAB with count + total value, multi-select, name/email/phone form, submits to /api/enquiries AND opens WhatsApp with full stone list
- About page: "Crafting Brilliance Since 2009" hero, story narrative, 4 core businesses, Chairman section (Jayesh Kavathiya), Vision, Mission (6 commitments), Why Choose (6 reasons), CTA
- Request a Stone form
- Contact page with WhatsApp/Email/Surat office cards
- Auth: Register, Login, Logout (JWT cookies + Bearer); buyer + admin roles
- Admin Panel: stock CRUD with photo/PDF/video upload via object storage, enquiry inbox
- Seed data: 89 diamonds (25 CVD, 21 Natural fancy, 28 Argyle Pink, 15 Argyle Blue) from uploaded inventory PDF + Argyle valuation sheet

## Credentials
Admin: admin@rainbowstar.in / rainbow@admin2026
Contact: +91 8145 644 444 · info@rainbowstar.in

## Prioritized Backlog (P0/P1/P2)
- P1: CSV bulk upload for stock (admin)
- P1: Real diamond photography / 360° videos (manual upload now functional)
- P2: Public certificate-number search → GIA/IGI API verification
- P2: Save shortlists per logged-in buyer
- P2: Rapnet/IDEX feed sync
- P2: Email notifications on enquiry (Resend integration)
