app.controller('ClientProfileController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function($http, AuthFactory, TemplateFactory, BudgetFactory) {
  console.log('Client Profile controller started');

  var self = this;

  var templateFactory = TemplateFactory;
  var budgetFactory = BudgetFactory;
  self.budget = {};
  self.flexArray = [];

  self.numPeople = 0;

  var buildFlexArray = function(number){
    self.flexArray = [];
    for (var i = 0; i < number; i++) {
      self.flexArray.push({flex_name: null, flex_amount: 0, temp_id: i});
    }
  }

  self.clickNumPeople = function(number) {
    self.numPeople = number;
    buildFlexArray(self.numPeople);
  }

  self.postBudget = function(){
    budgetFactory.postBudget(self.budget).then(function(response){
      budgetFactory.postFlexItems(self.flexArray);
      getBudget();
    });

  }






}]);
