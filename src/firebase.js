import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAnY77GDGPN8ageHpGKWoo3H9WLKcgW0Rc",
  authDomain: "lumiere-shop-33253.firebaseapp.com",
  projectId: "lumiere-shop-33253",
  storageBucket: "lumiere-shop-33253.firebasestorage.app",
  messagingSenderId: "641760576369",
  appId: "1:641760576369:web:012d83275ba2b131582cd0"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)