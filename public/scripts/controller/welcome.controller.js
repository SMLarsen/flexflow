(function() {
    app.controller('WelcomeController', ['$http', 'AuthFactory', 'BudgetFactory', function($http, AuthFactory, BudgetFactory) {
        console.log('WelcomeController started');

        var self = this;
        var authFactory = AuthFactory;
        var budgetFactory = BudgetFactory;
        var newUser = authFactory.isNewUser();

        if (!newUser) {
            budgetFactory.getBudget();
        }

    }]);

})();
