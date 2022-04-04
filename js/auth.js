// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
      console.log(user);
      db.collection('guides').onSnapshot(snapshot => {
        setupGuides(snapshot.docs);
        setupUI(user);
      }, err => console.log(err.message));
    } else {
        console.log("No user login")
      setupUI();
      setupGuides([]);
    }
  });
  
  // create new guide
  const createForm = document.querySelector('#create-form');
  createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('guides').add({
      title: createForm.title.value,
      content: createForm.content.value
    }).then(() => {
      // close the create modal & reset form
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    }).catch(err => {
      console.log(err.message);
    });
  });
  
  // signup
  const signupForm = document.querySelector('#signup-form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
  
    // sign up the user & add firestore data
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      return db.collection('users').doc(cred.user.uid).set({
        bio: signupForm['signup-bio'].value
      });
    }).then(() => {
      // close the signup modal & reset form
      const modal = document.querySelectorAll('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
  });
  
  // logout
  const logouts = document.querySelectorAll('#logout');
  
  logouts.forEach(logout => {logout.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut();
    });
  });
  
  /* const logout1 = document.querySelector('#logout-sidebar');
  
  logout1.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut();
    });
   */
  
  // login
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
  
    // log the user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
      // close the signup modal & reset form
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    });
  
  });

  //Anonymously login

  const Anonymously_login = document.getElementById('Anon_login');
  Anonymously_login.addEventListener('click', () => {
    firebase.auth().signInAnonymously()
    .then(() => {
      // Signed in..
      console.log("Anonymously login");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  });