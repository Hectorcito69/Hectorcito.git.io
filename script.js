
const firebaseConfig = {
  apiKey: "AIzaSyAhaC3BhMkaRECppVD86t-ToG_oGm6XDn4",
  authDomain: "votacionpagina.firebaseapp.com",
  projectId: "votacionpagina",
  storageBucket: "votacionpagina.firebasestorage.app",
  messagingSenderId: "525356536098",
  appId: "1:525356536098:web:5dfa7faef91bd216a7d57b",
  measurementId: "G-FT0D8H10LH"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


function register() {
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Registro exitoso, inicia sesión.");
        })
        .catch(error => alert(error.message));
}

// LOGIN
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            window.location.href = "votacion.html"; // Redirige a la votación
        })
        .catch(error => alert(error.message));
}

// LOGOUT
function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html"; // Redirige al login
    });
}

// VOTACIÓN
function votar(imagen) {
    let user = auth.currentUser;
    if (!user) {
        alert("Debes iniciar sesión para votar.");
        return;
    }

    let userId = user.uid;
    let votoRef = db.collection("votos").doc(userId);

    votoRef.get().then(doc => {
        if (doc.exists) {
            document.getElementById("mensaje").innerText = "Ya has votado antes.";
        } else {
            votoRef.set({ imagen: imagen }).then(() => {
                document.getElementById("mensaje").innerText = "Voto registrado correctamente.";
            });
        }
    });
}
