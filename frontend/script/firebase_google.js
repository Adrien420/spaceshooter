// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "spaceshooter-adproject.firebaseapp.com",
    databaseURL: "https://spaceshooter-adproject-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "spaceshooter-adproject",
    storageBucket: "spaceshooter-adproject.appspot.com",
    messagingSenderId: "320120443653",
    appId: "1:320120443653:web:0fc508daaefbf8d20e5d6c",
    measurementId: "G-FYB7YD8P2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const currentuser = auth.currentUser;
const provider = new GoogleAuthProvider(app);
const login = document.querySelector('#login');
const logout = document.querySelector('#logout');
const divGoogleAccount = document.getElementById("googleAccount");

login.addEventListener('click',(e) => {
    provider.setCustomParameters({
    prompt: 'select_account',
    remember: 'none'
    });
    signInWithPopup(auth, provider)
    .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
    }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    });
});

logout.addEventListener('click',(e) => {
    setPersistence(auth, browserSessionPersistence).then(() => {
        signOut(auth)
        .then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    });
});

auth.onAuthStateChanged(currentuser => {
const profilePicContainer = document.getElementById('imLogin');
if (currentuser) {
    // User is signed in
    profilePicContainer.src = currentuser.photoURL;
    logout.style.display = 'block';
    divGoogleAccount.style.width = '125px';
} else {
    // User is signed out
    profilePicContainer.src = 'images/GLogo.png';
    logout.style.display = 'none';
    divGoogleAccount.style.width = '70px';
}
});
