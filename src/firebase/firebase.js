import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAIa83M1JdQooaFGhcxqmtL-f9s9vCJrUM",
  authDomain: "minpasu-891f2.firebaseapp.com",
  projectId: "minpasu-891f2",
  storageBucket: "minpasu-891f2.firebasestorage.app",
  messagingSenderId: "605609579593",
  appId: "1:605609579593:web:5e5bfcf5390afd113d5b98",
  measurementId: "G-Z55YMQSBR3",
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

