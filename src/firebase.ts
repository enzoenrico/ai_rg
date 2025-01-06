// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD-mAmByxoTkV8wtvkek3dTOSNl2dxYGI4",
    authDomain: "digital-5fead.firebaseapp.com",
    projectId: "digital-5fead",
    storageBucket: "digital-5fead.firebasestorage.app",
    messagingSenderId: "730732357706",
    appId: "1:730732357706:web:77e481928ddde9c2ea1eb3",
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig)