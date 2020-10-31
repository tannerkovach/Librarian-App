// --- Global variables ---
const library = document.querySelector('.library'),
    newBookBtn = document.querySelector('.newBookBtn'),
    newBookForm = document.querySelector('#newBookForm'),
    formModal = new bootstrap.Modal(document.getElementById('formModal'));

let currentUser;


// --------------- Render book library from database ---------------
const render = (data) => {
    currentUser = auth.currentUser;

    let clearList = document.querySelectorAll('.book');
    clearList.forEach(function(book) {
        book.remove(); 
    })

    data.forEach(doc => { 
        let docData = doc.data();
        const html = `
        <div class="bookDetails card">
            <div class="g-0 d-flex">
                <div class="card-body">
                    <img src="${docData.isbn ? `http://covers.openlibrary.org/b/isbn/${docData.isbn}-L.jpg` : `https://via.placeholder.com/125x200.jpg?text=Book`}" 
                    class="card-img" 
                    alt="${docData.title} book cover">
                </div>
              
                <div class="card-body d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                        <h3 class="title card-title text-truncate mb-2">${docData.title}</h3>
                        <h5 class="author card-subtitle mb-3">${docData.author}</h5>

                        <h6 class="pageCount text-muted mb-2 font-weight-light">${docData.pageCount} pages</h6>
                        <h6 class="pageCount text-muted mb-2 font-weight-light">ISBN: ${docData.isbn ? docData.isbn : `(Add ISBN for book cover)`}</h6>
                    </div>
                    <div class="readStatus d-flex flex-row" data-status="${docData.readStatus}">
                        <button data-key="${doc.id}" class="toggleStatusBtn flex-fill mr-3 btn btn-sm text-white ${docData.readStatus ? `btn-primary` : `btn-secondary`}">${docData.readStatus ? `Read` : `Unread`}</button>
                        <button data-key="${doc.id}" class="removeEntryBtn flex-fill btn btn-sm btn-danger text-white">Remove</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        let book = document.createElement('li'); 
        book.classList.add('book','col-12','col-lg-6');
        book.id = doc.id;
        book.innerHTML = html;

        library.appendChild(book); 
    })
}



// --------------- Form data pushed to database ---------------
// const push = (data) => {
//     console.log('user id: ', data)
   
    if (newBookForm) {
        newBookForm.addEventListener('submit', function (event) {
            event.preventDefault();
            currentUser = auth.currentUser;
            let title = document.forms[0]["formTitle"].value, /* Take the values submitted from user and store */
                author = document.forms[0]["formAuthor"].value,
                pageCount = parseInt(document.forms[0]["formPageCount"].value),
                readStatus = document.forms[0]["formReadStatus"].checked,
                isbn = document.forms[0]["formISBN"].value;
            
                let libraryDocRef = database.collection('users').doc(currentUser.uid).collection('library').doc();
    
        
                        
                            libraryDocRef.set({ /* Push stored values to database */
                                title: title,
                                author: author,
                                pageCount: pageCount,
                                readStatus: readStatus,
                                uid: currentUser.uid,
                                isbn: isbn,
                                timestamp: firebase.firestore.Timestamp.fromDate(new Date())
                            })
                        
                            .then(() => {
                                console.log('Document successfully added!');
                
                                console.log('pushed data to id:', currentUser.uid)
                            })
                            .catch((error) => {
                                console.error('Error updating document: ', error);
                            });
                        
                        
            
            
            newBookForm.reset(); /* Reset the form after push, for better UX */
            formModal.hide() /* Hide modal after pushing data */
        })
    }
// }


// --------------- Toggle readStatus property ---------------
function toggle(keyToToggle) { 
    let nodeRef = database.collection('users').doc(currentUser.uid).collection('library').doc(keyToToggle), /* Retrieve unique key from click event and use to query database */
        liKey = document.getElementById(keyToToggle),
        liReadStatus = liKey.querySelector('.readStatus'),
        liDataKey = liReadStatus.getAttribute('data-status');
	
    if (liDataKey == 'true') { /* If the list item's data-status attribute equals true */
		nodeRef.update ({ /* Push the opposite boolean value to database */
			readStatus: false
    	})
	}
	
	else {
		nodeRef.update ({
        	readStatus: true
    	})
	}
}

// --------------- Update & delete click event initiation ---------------
function clickEvent( event ) { 
    currentUser = auth.currentUser;
    let libraryDocRef = database.collection('users').doc(currentUser.uid).collection('library');
    
    let key = event.target.dataset.key; /* Retrieve users click target and if it has a data-key attribute, save it */

    if (event.target.classList.contains("toggleStatusBtn")) {
        toggle(key); /* If user clicked on the toggleStatusBtn, push the unique key to the toggle function */
    }
 
	if (event.target.classList.contains("removeEntryBtn")) {
		const bookToRemove = document.getElementById(key);
		const nodeToRemove = libraryDocRef.doc(key);
        bookToRemove.remove();
        nodeToRemove.delete(); /* If user clicked on the removeEntryBtn, remove node from database and HTML */
	}
}

// --------------- Event listeners ---------------
library.addEventListener("click", clickEvent);











// // --- Global variables ---
// const library = document.querySelector('.library'),
//       newBookBtn = document.querySelector('.newBookBtn'),
//       newBookForm = document.querySelector('#newBookForm'),
//       formModal = new bootstrap.Modal(document.getElementById('formModal')),
//       emptyLibraryMsg = document.querySelector('.emptyLibraryMsg'),
//       formSubmitBtn = document.querySelector('#formSubmitBtn');

// let currentUser;


// // --------------- Render book library from database ---------------
// const render = (renderData) => {
//     let clearList = document.querySelectorAll('.book');
//     clearList.forEach(function(book) {
//         book.remove(); 
//     })
        
//     renderData.forEach(doc => { 
//         let docData = doc.data();
//         const html = `
//         <div class="bookDetails card">
//             <div class="card-body">
//                 <h4 class="title card-title mb-2">${docData.title}</h4>
//                 <h6 class="author card-subtitle mb-1">${docData.author}</h6>
//                 <div class="">
//                     <h6 class="pageCount text-muted mb-3 font-weight-light">${docData.pageCount} pages</h6>
//                     <div class="readStatus d-flex flex-column" data-status="${docData.readStatus}">
//                         <button data-key="${doc.id}" class="toggleStatusBtn btn btn-sm ${docData.readStatus ? `btn-primary` : `btn-secondary`}">${docData.readStatus ? `Read` : `Unread`}</button>
//                     </div>
//                 </div>
//             </div>
//             <button class="removeEntryBtn btn btn-close position-absolute top-0 right-0 p-2" data-key="${doc.id}"></button>
//         </div>
//         `;

//         let book = document.createElement('li'); /* Because template literals aren't a DOM node, create a new node on the body document to attach it to */
//         book.classList.add('book','col-12','col-lg-4');
//         book.id = doc.id;
//         book.innerHTML = html;

//         library.appendChild(book); 
//     })
// }

// // --------------- Form data pushed to database ---------------

// // function pushData() {
    
//     newBookForm.addEventListener('submit', function (event) {
//         event.preventDefault();
//         currentUser = auth.currentUser;
//         console.log('currentUser', currentUser)
        
//         let title = document.forms[0]["ftitle"].value, /* Take the values submitted from user and store */
//             author = document.forms[0]["fauthor"].value,
//             pageCount = parseInt(document.forms[0]["fpages"].value),
//             readStatus = document.forms[0]["fread"].checked;
        
        
//         let libraryDocRef = database.collection('users').doc(currentUser.uid).collection('library').doc();
    
        
//         if (currentUser.uid) {
//             libraryDocRef.set({ /* Push stored values to database */
//                 title: title,
//                 author: author,
//                 pageCount: pageCount,
//                 readStatus: readStatus,
//                 timestamp: firebase.firestore.Timestamp.fromDate(new Date())
//             })
        
//             .then(() => {
//                 console.log('Document successfully added!');

//                 console.log('pushed data to id:', currentUser.uid)
//             })
//             .catch((error) => {
//                 console.error('Error updating document: ', error);
//             });
//         }
//         else{
//             console.log('wires crossed')
//         }
        
        
//         newBookForm.reset(); /* Reset the form after push, for better UX */
//         formModal.hide() /* Hide modal after pushing data */
//     })
// // }    



// // function getData() {
// //     currentUser = auth.currentUser;

// //     // document.querySelector('#user-email').innerHTML = (currentUser != null ? currentUser.email : '');

// //     console.log('currentUser', currentUser)
// //     if (currentUser === null) {
// //         // todoList.innerHTML = '<h3 class="center-align">Please login to get todos</h3>';
// //         // return;
// //         console.log('doesnt work')
// //     }
// //     // db.collection('alltodos').doc(currentUser.uid).collection('todos').orderBy('title').onSnapshot(snapshot => {
// //     //     let changes = snapshot.docChanges()
// //     //     changes.forEach(change => {
// //     //         if (change.type == 'added') {
// //     //             renderList(change.doc);

// //     //         } else if (change.type == 'removed') {
// //     //             let li = todoList.querySelector(`[data-id=${change.doc.id}]`);
// //     //             todoList.removeChild(li);
// //     //         } else if (change.type == 'modified') {
// //     //             let li = todoList.querySelector(`[data-id=${change.doc.id}]`);
// //     //             li.getElementsByTagName('span')[0].textContent = newTitle;
// //     //             newTitle = '';
// //     //         }
// //     //     });
// //     // })
// // }


// // --------------- Toggle readStatus property ---------------
// // function toggle(keyToToggle) { 
// //     let nodeRef = firebase.database().ref('library/' + keyToToggle), /* Retrieve unique key from click event and use to query database */
// //         liKey = document.getElementById(keyToToggle),
// //         liReadStatus = liKey.querySelector('.readStatus'),
// //         liDataKey = liReadStatus.getAttribute('data-status');
	
// //     if (liDataKey == 'true') { /* If the list item's data-status attribute equals true */
// // 		nodeRef.update ({ /* Push the opposite boolean value to database */
// // 			readStatus: false
// //     	})
		
// // 		liReadStatus.innerHTML = "false"; /* Replace list items innerHTML with opposite boolean value */
// // 	}
	
// // 	else {
// // 		nodeRef.update ({
// //         	readStatus: true
// //     	})
		
// // 		liReadStatus.innerHTML = "true";
// // 	}
// // }


// // --------------- Update & delete click event initiation ---------------
// function clickEvent( event ) { 
//     currentUser = auth.currentUser;
//     let key = event.target.dataset.key; /* Retrieve users click target and if it has a data-key attribute, save it */
//     let libraryRef = database.collection('users').doc(currentUser.uid).collection('library');

//     if (event.target.classList.contains("toggleStatusBtn")) {
//         toggle(key); /* If user clicked on the toggleStatusBtn, push the unique key to the toggle function */
//     }
 
// 	if (event.target.classList.contains("removeEntryBtn")) {
// 		const bookToRemove = document.getElementById(key);
// 		const nodeToRemove = libraryRef.doc(key);
//         bookToRemove.remove();
//         nodeToRemove.delete(); /* If user clicked on the removeEntryBtn, remove node from database and HTML */
// 	}
// }

// // --------------- Event listeners ---------------
// library.addEventListener("click", clickEvent);
