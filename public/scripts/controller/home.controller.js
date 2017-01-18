app.controller("HomeController", ["$http", "AuthFactory", "TemplateFactory", "AdminFactory", function($http, AuthFactory, TemplateFactory, AdminFactory) {
    console.log('HomeController started');

    var self = this;
    var authFactory = AuthFactory;
    var adminFactory = AdminFactory;
    var templateFactory = TemplateFactory;
    self.navActive = false;

    templateFactory.loadTemplateData();
    adminFactory.getAdminData();

    self.activateMobileNav = function() {
        if (self.navActive === false) {
            self.navActive = true;
        } else {
            self.navActive = false;
        }
    };

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
