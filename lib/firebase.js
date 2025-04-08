import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjyYJJIS3FxevgKYDaYSVhZUb32uhqS9Y",
  authDomain: "project-1645935594523067912.firebaseapp.com",
  databaseURL: "https://project-1645935594523067912-default-rtdb.firebaseio.com",
  projectId: "project-1645935594523067912",
  storageBucket: "project-1645935594523067912.firebasestorage.app",
  messagingSenderId: "756356441190",
  appId: "1:756356441190:web:5596dc35b159cdbd6d79a7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
