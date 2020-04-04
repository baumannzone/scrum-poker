// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app'

// Add the Firebase products that you want to use
import 'firebase/firestore'

const apiKey = process.env.VUE_APP_FIREBASE_API_KEY

const firebaseConfig = {
  apiKey,
  authDomain: 'scrum-poker-vue.firebaseapp.com',
  databaseURL: 'https://scrum-poker-vue.firebaseio.com',
  projectId: 'scrum-poker-vue',
  storageBucket: 'scrum-poker-vue.appspot.com',
  messagingSenderId: '816866661794',
  appId: '1:816866661794:web:2312b188366cb0123e4efb',
  measurementId: 'G-XT3GR2T7PS'
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

// Export database
export const db = firebaseApp.firestore()
