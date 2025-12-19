// ...auth service placeholder...
// admin-dashboard/src/services/auth.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAV-8BLQ6iXONhLuB3yDuM2dPX4-YSmw08",
  authDomain: "project-66d1b.firebaseapp.com",
  projectId: "project-66d1b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
