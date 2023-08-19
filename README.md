# Event Management API

## API Endpoints

1. **Get All Events**
   - Endpoint: `GET /api/v1/events/get-all-events`

2. **Add New Event**
   - Endpoint: `POST /api/v1/events/add`
   - Sample Request Body:
     ```json
     {
       "duration": 20,
       "startHours": "2023-08-20T10:00:00+05:30",
       "endHours": "2023-08-20T10:20:00+05:30",
       "timezone": "Asia/Kolkata"
     }
     ```

3. **Get Free Slot**
   - Endpoint: `GET /api/v1/events/get-free-slot`

## Project Setup

1. **Install Dependencies:** Run `npm install` to install required dependencies.

2. **Firebase Admin SDK Setup:** Set up Firebase Admin SDK credentials as per official documentation.

3. **Configure Firestore:** Ensure Firestore database is set up correctly.

## Database and Query Design

Firestore "events" collection stores event details with fields:
- `duration`: Duration of event in minutes.
- `startHours`: Start time of event in UTC with timezone info.
- `endHours`: End time of event in UTC with timezone info.
- `timezone`: Timezone of the event.

