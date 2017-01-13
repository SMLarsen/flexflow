app.controller("HomeController", ["$http", "AuthFactory", "TemplateFactory", function($http, AuthFactory, TemplateFactory) {
    console.log('HomeController started');
    
    var self = this;
    var authFactory = AuthFactory;
    var templateFactory = TemplateFactory;

    templateFactory.loadTemplateData();

    // Function to Login
    self.logIn = function() {
        authFactory.logIn()
            .then(function(currentUser) {
                // console.log('lc current user', currentUser);
                authFactory.idToken = currentUser.idToken;
                self.isUserLoggedIn = true;
                authFactory.isUserLoggedIn = self.isUserLoggedIn;
                window.location = '/#/clientprofile';
            });
    }; // End Login

    // Function to Logout
    self.logOut = function() {
        authFactory.logOut().then(function(response) {
            console.log('User logged out');
        });
    }; // End Logout

}]); // END: NavController
