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
const filterRead = document.querySelector('.filterRead');
const filterUnread = document.querySelector('.filterUnread');
const filterNone = document.querySelector('.filterNone');
const filterSelected = document.querySelector('.filterSelected');

auth.onAuthStateChanged(user => {
    if (user) {
        const libraryRef = database.collection(`users/${user.uid}/library`).orderBy('timestamp', 'asc');
        
        //if user is signed && user clicks filter unread, show unread books
        filterUnread.addEventListener('click', filter);
        filterRead.addEventListener('click', filter);
        filterNone.addEventListener('click', filter);
        filterSelected.addEventListener('click', filter);
        function filter(event) { 
            if (event.target.classList.contains("filterRead")) {
                const filteredTrueRef = database.collection(`users/${user.uid}/library`).where("readStatus", "==", true);
                filteredTrueRef
                .onSnapshot(function(data) {
                    render(data.docs);
                })
                filterSelected.classList.remove('d-none')
                filterSelected.innerHTML = `Read <svg width="1em" height="1em" viewBox="0 0 16 16" class="filterSelected ml-1 bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>`;
            }
            else if (event.target.classList.contains("filterUnread")) {
                const filteredFalseRef = database.collection(`users/${user.uid}/library`).where("readStatus", "==", false);
                filteredFalseRef
                .onSnapshot(function(data) {
                    render(data.docs);
                })
                filterSelected.classList.remove('d-none')
                filterSelected.innerHTML = `Unread <svg width="1em" height="1em" viewBox="0 0 16 16" class="filterSelected ml-1 bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>`;
            }
            else if (event.target.classList.contains("filterSelected") || event.target.classList.contains("filterNone")) {
                libraryRef
                .onSnapshot(function(data) {
                    render(data.docs);
                })
                filterSelected.classList.add('d-none');
            }
        }

        libraryRef
        .onSnapshot(function(data) {
            render(data.docs);
        })

        //if user is signed && user clicks filter read, show read books
        
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




