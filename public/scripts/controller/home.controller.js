app.controller("HomeController", ["$http", "AuthFactory", "TemplateFactory", "AdminFactory", "BudgetFactory", function($http, AuthFactory, TemplateFactory, AdminFactory, BudgetFactory) {
    // console.log('HomeController started');

    var self = this;
    var authFactory = AuthFactory;
    var adminFactory = AdminFactory;
    var templateFactory = TemplateFactory;
    var budgetFactory = BudgetFactory;
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
                authFactory.idToken = currentUser.idToken;
                self.isUserLoggedIn = true;
                authFactory.isUserLoggedIn = self.isUserLoggedIn;
                if (authFactory.isNewUser() === true) {
                    window.location = '/#/clientprofile';
                } else {
                    budgetFactory.getBudget().then(function(result) {
                        var budget = result;
                        switch (budget.budget_status) {
                            case "Finished":
                                window.location = "/#/results";
                                break;
                            case "Comments":
                                window.location = "/#/results";
                                break;
                            case "Financial":
                                window.location = "/#/additionalinfo";
                                break;
                            case "Functional":
                                window.location = "/#/financialspend";
                                break;
                            case "Flow":
                                window.location = "/#/functionalspend";
                                break;
                            case "Flex":
                                window.location = "/#/flowspend";
                                break;
                            case "Profile":
                                window.location = "/#/flexspend";
                                break;
                            default:
                                window.location = "/#/clientprofile";
                        }
                    });
                }
            });
    }; // End Login

}]); // END: NavController
