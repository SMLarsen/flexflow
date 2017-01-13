app.controller('ClientProfileController', ['BudgetFactory', function(BudgetFactory) {
  console.log('Client Profile controller started');

  var self = this;

  var budgetFactory = BudgetFactory;

  self.budget = {};
  self.flexArray = [];

  self.numPeople = 0;

  // Function to build array of people in flex budget
  var buildFlexArray = function(number){
    self.flexArray = [];
    for (var i = 0; i < number; i++) {
      self.flexArray.push({flex_name: null, flex_amount: null, temp_id: i});
    }
  }; // End: buildFlexArray

  // Function for selecting number of adults in household
  self.clickNumPeople = function(number) {
    self.numPeople = number;
    buildFlexArray(self.numPeople);
  }; // End: clickNumPeople

  // Function for posting salary info to DB
  self.postBudget = function(){
    budgetFactory.postBudget(self.budget).then(function(response){
      budgetFactory.postFlexItems(self.flexArray);
      getBudget();
      getSavings();
    });
  }; // End: postBudget

  self.budget = {};
  self.savings = undefined;
  self.monthSavings = undefined;

  // Function for getting savings from DB and calculating yearly and monthly
  function getSavings() {
    budgetFactory.getBudget().then(function(response){
      self.budget = response;
      self.savings = parseInt(self.budget.annual_salary) * .20;
      self.monthSavings = parseInt(self.savings) / 12;
    });
  }; // End: getSavings

}]); // END: ClientProfileController
