app.factory("AuthFactory", function($firebaseAuth, $http) {
    console.log('AuthFactory started');
    var auth = $firebaseAuth();

    var currentUser = {};
    var newUser = true;

    // Authenticates user at login
    logIn = function() {
        return auth.$signInWithPopup("google")
            .then(function(firebaseUser) {
                console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
                currentUser = firebaseUser.user;
                return currentUser.getToken()
                    .then(function(idToken) {
                        return $http({
                                method: 'GET',
                                url: '/privateData',
                                headers: {
                                    id_token: idToken
                                }
                            })
                            .then(function(response) {
                                    currentUser.authIdToken = idToken;
                                    newUser = currentUser.newUser;
                                    console.log('current user authorized');
                                    return currentUser;
                                },
                                function(err) {
                                    console.log('current user not registered', err);
                                    return;
                                })
                            .catch(function(error) {
                                console.log("Authentication failed: ", error);
                            });
                    });
            });
    }; // END: logIn

    // Function handles user log out
    logOut = function() {
        return auth.$signOut().then(function() {
            currentUser = {};
            console.log('Logging the user out!');
        });
    }; // END: logOut

    // Function get idToken
    getIdToken = function() {
        // console.log('getIdToken currentUser', currentUser);
        if (currentUser) {
            // This is where we make our call to our server
            return currentUser.getToken().then(function(idToken) {
                    currentUser.authIdToken = idToken;
                    console.log('got current user idToken:', currentUser.email);
                    return currentUser;
                },
                function(err) {
                    console.log('current user not registered', err);
                    return;
                });
        } else {
            return;
        }
    }; // End getIdToken

    // This code runs whenever the user changes authentication states
    // e.g. whevenever the user logs in or logs out
    // this is where we put most of our logic so that we don't duplicate
    // the same things in the login and the logout code
    // auth.$onAuthStateChanged(function(firebaseUser) {
    //     // firebaseUser will be null if not logged in
    //     self.currentUser = firebaseUser;
    //     if (firebaseUser) {
    //         // This is where we make our call to our server
    //         firebaseUser.getToken().then(function(idToken) {
    //             $http({
    //                 method: 'GET',
    //                 url: '/privateData',
    //                 headers: {
    //                     id_token: idToken
    //                 }
    //             }).then(function(response) {
    //                 self.currentUser = response.data;
    //             });
    //         });
    //     } else {
    //         console.log('Not logged in or not authorized.');
    //         self.currentUser = [];
    //     }
    // });

    var publicApi = {
        currentUser: currentUser,
        newUser: newUser,
        getIdToken: function() {
            return getIdToken();
        },
        logIn: function() {
            return logIn();
        },
        logOut: function() {
            return logOut();
        }
    };

    return publicApi;

}); // END: AuthFactory
