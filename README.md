# GymBro Frontend

A React Native + Expo mobile app for fitness tracking, with JWT authentication and tracking for food, water, sleep, workouts, and junk food.

## Features
- JWT-based authentication (login/signup)
- Dashboard with streak summary
- Track food, water, sleep, workouts, and junk food
- Protected screens (only accessible after login)
- Axios service with auth token interceptor
- Modern, simple UI (ready for custom styling)

## Folder Structure
```
/screens         # All app screens
/components      # Reusable components
/context         # Auth context
/services        # Axios API service
```

## Running the App (Expo Go on iPhone)
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set your backend URL:**
   - Edit `services/api.js` and set your backend URL in the `baseURL` field.
3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```
4. **Install Expo Go on your iPhone** (from the App Store).
5. **Scan the QR code** from the terminal or browser with Expo Go to open the app on your iPhone.

## Notes
- Make sure your backend is accessible from your iPhone (same WiFi, or use a tunnel like [ngrok](https://ngrok.com/)).
- You can style the UI as you like; the logic and navigation are ready. 