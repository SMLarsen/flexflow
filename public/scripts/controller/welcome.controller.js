(function() {
    app.controller('WelcomeController', ['$http', 'AuthFactory', 'BudgetFactory', function($http, AuthFactory, BudgetFactory) {
        console.log('WelcomeController started');

        var self = this;
        var authFactory = AuthFactory;
        var budgetFactory = BudgetFactory;

        self.newUser = authFactory.currentUser.newUser;
        console.log('setting newuser', self.newUser);

        if (!self.newUser) {
            budgetFactory.getBudget();
            console.log('getBudget in welcome', budgetFactory.getBudget());
        }

    }]);

})();
