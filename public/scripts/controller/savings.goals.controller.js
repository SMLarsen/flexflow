app.controller('SavingsGoalsController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function($http, AuthFactory, TemplateFactory, BudgetFactory) {
  console.log('Savings Goals controller started');

  var self = this;
  var templateFactory = TemplateFactory;
  var budgetFactory = BudgetFactory;
  self.budget = {};
  self.savings = undefined;
  self.monthSavings = undefined;





  getSavings();
  function getSavings() {
    budgetFactory.getBudget().then(function(response){
      self.budget = response;
      self.savings = self.budget.annual_salary * .20;
      self.monthSavings = self.savings / 12;
    });
  }




}]);
