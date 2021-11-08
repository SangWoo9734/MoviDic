import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCTgOH4hH8GdM9FRhyIdNb4Rzlg5_QThHc",
    authDomain: "movidic-login.firebaseapp.com",
    projectId: "movidic-login",
    storageBucket: "movidic-login.appspot.com",
    messagingSenderId: "920799641651",
    appId: "1:920799641651:web:5b653f87f106f18a5b2346",
    measurementId: "G-7MPDCRLKED"
  };

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const authService = firebase.auth();
