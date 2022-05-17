import Firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/auth'
import 'firebase/compat/storage'
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyADGT-Y0ULTlnqe4nqFHXHbRSkmIORqBNk",
    authDomain: "library-management-syste-697e8.firebaseapp.com",
    projectId: "library-management-syste-697e8",
    storageBucket: "library-management-syste-697e8.appspot.com",
    messagingSenderId: "95746426304",
    appId: "1:95746426304:web:e5c7150e60fe1d0d8bb425"
}

const firebase = Firebase.initializeApp(config)
const {FieldValue} = Firebase.firestore

export {firebase, FieldValue}