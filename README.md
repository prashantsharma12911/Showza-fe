# Showza Admin Portal

React + Chakra UI admin portal for the Showza backend (`D:\PROJECTS\Dev\Showza`). Provides CRUD screens for every entity: City, Event Venue, Screen, Seat, Actor, Movie, Movie Show, Show Seat, User, Offer, Booking, Payment, Refund.

## Running

1. Start the backend (needs MySQL running with the `showza` schema):
   ```bash
   cd D:\PROJECTS\Dev\Showza
   mvn spring-boot:run
   ```
   It listens on `http://Showza-dev-env.eba-c3h2hppu.ap-south-1.elasticbeanstalk.com`.

2. Start the frontend:
   ```bash
   npm install
   npm run dev
   ```
   Opens on `http://localhost:5173`.

3. Log in with the hardcoded admin credentials (see `src/auth/AuthContext.tsx`):
   - Username: `admin`
   - Password: `showza@admin123`

   Auth is client-side only — the backend has no login endpoint or user credentials. Change the constants in `AuthContext.tsx` to update the password.

## Configuration

Set `VITE_API_BASE_URL` in a `.env` file to point at a different backend host (defaults to `http://Showza-dev-env.eba-c3h2hppu.ap-south-1.elasticbeanstalk.com`). See `.env.example`.

## Backend change required

The backend had no CORS configuration, which blocks any browser-based frontend. A `WebConfig` class was added at
`D:\PROJECTS\Dev\Showza\src\main\java\com\Showza\swz\config\WebConfig.java` allowing requests from `http://localhost:5173` to `/api/**`. Update the allowed origin there if you deploy the frontend elsewhere.

## Architecture

- All 13 entity screens are generated from a single config-driven CRUD system (`src/config/entities.ts` + `src/components/EntityListPage.tsx` + `src/components/EntityFormModal.tsx`), since every backend controller follows an identical `GET/POST/PUT/DELETE` pattern with entities directly serialized (no DTOs, no pagination).
- Relations (e.g. `EventVenue.city`, `Seat.screen`) are rendered as dropdowns populated from the related entity's list endpoint, and submitted as `{ id: <n> }` to match how the backend resolves JPA references.
- Enum fields (`SeatType`, `PriceTier`, `ShowSeatStatus`, `BookingStatus`, `PaymentStatus`, `RefundStatus`, `Role`) are rendered as selects with the exact backend enum values.

## Known backend gaps (not fixed by this frontend)

- No authentication/authorization on the API — anything can call any endpoint. The login page here is a client-side gate only.
- No global exception handler — a 404 lookup (e.g. bad ID) returns Spring's default error body, not a structured error. The frontend surfaces whatever message it gets.
