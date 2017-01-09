app.controller('WelcomeController', ['$http', 'AuthFactory', 'BudgetFactory', function($http, AuthFactory, BudgetFactory) {
  console.log('WelcomeController started');

var self = this;
var authFactory = AuthFactory;
var budgetFactory = BudgetFactory;

self.newUser = authFactory.newUser;

if (!self.newUser) {
  budgetFactory.getBudget().then(function(result) {
    console.log('getBudget in welcome', result);
  });
}

}]);
