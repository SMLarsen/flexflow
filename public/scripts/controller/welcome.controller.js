(function() {
    app.controller('WelcomeController', ['$http', 'AuthFactory', 'BudgetFactory', function($http, AuthFactory, BudgetFactory) {
        console.log('WelcomeController started');

        var self = this;
        var authFactory = AuthFactory;
        var budgetFactory = BudgetFactory;
        var newUser = authFactory.isNewUser();

        // budget profile for testing
        var testProfile = {
            budget_start_month: 03,
            budget_start_year: 2017,
            monthly_take_home_amount: 10000,
            annual_salary: 200000,
            meeting_scheduled: true
        };

        if (!newUser) {
            budgetFactory.getBudget()
                .then(function(result) {
                    self.budget = result;
                    // console.log('WelcomeController budget', self.budget);
                });
        }

        self.postBudget = function() {
            console.log('post clicked');
            budgetFactory.postBudget(self.budget)
                .then(function(result) {
                        console.log('Profile inserted');
                        return;
                    },
                    function(err) {
                        console.log('Error inserting profile for', currentUser.email, ': ', err);
                        return;
                    });
        };

        self.updateBudget = function() {
            console.log('update clicked');
            budgetFactory.updateBudget(self.budget)
                .then(function(result) {
                        console.log('Profile updated');
                        return;
                    },
                    function(err) {
                        console.log('Error updating profile for', currentUser.email, ': ', err);
                        return;
                    });
        };

    }]);

})();
