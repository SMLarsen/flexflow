app.controller('ClientProfileController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function($http, AuthFactory, TemplateFactory, BudgetFactory) {
  console.log('Client Profile controller started');

  var self = this;

  var templateFactory = TemplateFactory;
  var budgetFactory = BudgetFactory;
  self.budget = {};
  console.log(self.budget);
  self.postBudget = function(){
    budgetFactory.postBudget(self.budget);
  }
  getBudget();

  self.numPeople = 0;

  self.clickOnePerson = function() {
    self.numPeople = 1;
  }

  self.clickTwoPeople = function() {
    self.numPeople = 2;
  }

  self.clickThreePeople = function() {
    self.numPeople = 3;
  }

  self.clickFourPeople = function() {
    self.numPeople = 4;
  }



}]);
