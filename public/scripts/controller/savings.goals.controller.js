app.controller('SavingsGoalsController', ['BudgetFactory', function(BudgetFactory) {
  console.log('Savings Goals controller started');

  var self = this;

  var budgetFactory = BudgetFactory;

  self.budget = {};
  self.savings = undefined;
  self.monthSavings = undefined;

  getSavings();

  // Function for getting savings from DB and calculating yearly and monthly
  function getSavings() {
    budgetFactory.getBudget().then(function(response){
      self.budget = response;
      self.savings = parseInt(self.budget.annual_salary) * .20;
      self.monthSavings = parseInt(self.savings) / 12;
    });
  }; // End: getSavings

}]); // END: SavingsGoalsController
