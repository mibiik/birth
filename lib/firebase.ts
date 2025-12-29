import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDRwc1Bzz97HSc8uDEWFJXgvFNV0i8PWXM",
  authDomain: "birthday-3a12d.firebaseapp.com",
  projectId: "birthday-3a12d",
  storageBucket: "birthday-3a12d.firebasestorage.app",
  messagingSenderId: "1094492866840",
  appId: "1:1094492866840:web:c86f11afefd7a40e20366d",
  measurementId: "G-3K5SY01HSC"
}

// Firebase'i sadece istemci tarafında başlat
let app, db, analytics

if (typeof window !== "undefined") {
  try {
    // Eğer app zaten başlatılmamışsa başlat
    if (!app) {
      app = initializeApp(firebaseConfig)
      db = getFirestore(app)
      analytics = getAnalytics(app)
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    throw new Error("Firebase bağlantısı kurulamadı")
  }
}

export { app, db, analytics }
