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
    }); // End: postBudget

  };

}]); // END: ClientProfileController
