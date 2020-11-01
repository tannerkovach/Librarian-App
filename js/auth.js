const signupForm = document.querySelector('#signupForm');
const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
const logout = document.querySelector('#logoutBtn');
const login = document.querySelector('#loginBtn');
const loginClass = document.querySelector('.loginBtn');
const signup = document.querySelector('#signupBtn');
const loginForm = document.querySelector('#loginForm');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const signInMsg = document.querySelector('.signInLibraryMsg');
const emptyLibraryMsg = document.querySelector('.emptyLibraryMsg');
const loggedInUser = document.querySelector('.loggedInUser');
const controlCenter = document.querySelector('.controlCenter');

auth.onAuthStateChanged(user => {
    if (user) {
        const libraryRef = database.collection(`users/${user.uid}/library`).orderBy('timestamp', 'asc');
        
        //if user is signed && user clicks filter unread, show unread books
        libraryRef
        .onSnapshot(function(data) {
            render(data.docs);
        })
        //if user is signed && user clicks filter read, show read books
        const filteredLibraryRef = database.collection(`users/${user.uid}/library`).where("readStatus", "==", true);
       
        filteredLibraryRef
        .onSnapshot(function(data) {
            console.log(data.docs)
        })

        //else, render all books
    
        loggedInUser.innerHTML = `${user.displayName}`;
        loggedInUser.classList.remove('d-none');
        logout.classList.remove('d-none');
        login.classList.add('d-none');
        signup.classList.add('d-none');
        loginClass.classList.add('d-none');
        signInMsg.classList.add('d-none');
        controlCenter.classList.remove('d-none');
        controlCenter.classList.add('d-flex');
        
        
        
        console.log('user data docs',user)
        database.collection(`users/${user.uid}/library`).onSnapshot(function(data) {
           
            if (data.docs.length == 0) {
                setTimeout(function(){ 
                    emptyLibraryMsg.classList.remove('d-none');
                }, 500);
            }
            else {
                emptyLibraryMsg.classList.add('d-none');
            }
        });
        
        consoleLog(`User is signed in: ${user.uid}`, 'success')
    }
    else {
        loggedInUser.innerHTML = '';
        loggedInUser.classList.add('d-none');
        signup.classList.remove('d-none');
        logout.classList.add('d-none')
        login.classList.remove('d-none');
        loginClass.classList.remove('d-none');
        
        signInMsg.classList.remove('d-none');
        emptyLibraryMsg.classList.add('d-none');
        controlCenter.classList.add('d-none');

        render();
        consoleLog('User is signed out.', 'warning')
    }
})

// sign up functionality
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let user = firebase.auth().currentUser;
    let email = signupForm["signupEmail"].value, 
        password = signupForm["signupPassword"].value,
        displayName = signupForm["signupDisplayName"].value;
        
    auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
        database.collection('users').doc(cred.user.uid)
        .set({
            email: cred.user.email
        })
        cred.user.updateProfile({
            displayName: displayName
        })
        .then(function() {
            
                loggedInUser.innerHTML = `${cred.user.displayName}`;
                loggedInUser.classList.remove('d-none');
            
            signupModal.hide();
            signupForm.reset();
            
        })
        .catch(function(error) {
            console.log('error',error)
        });
    })
});

// log in functionality
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let email = loginForm["loginEmail"].value, 
        password = loginForm["loginPassword"].value;
        
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        loginModal.hide();
        loginForm.reset();
    })
});

// sign out functionality
logout.addEventListener('click', function(e) {
    e.preventDefault();
    
    auth.signOut();
    render();
})