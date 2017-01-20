app.controller('FlexSpendController', ['BudgetFactory', function(BudgetFactory) {
  console.log('Flex Spend controller started');

  var self = this;

  var budgetFactory = BudgetFactory;

  budgetFactory.getBudget().then(function(results){
    self.budget = results;
  });
  
  self.navActive = false;

  self.activateMobileNav = function() {
    if(self.navActive === false){
      self.navActive = true;
    } else {
      self.navActive = false;
    }
  };

  budgetFactory.getFlexItems().then(function(result){
    self.flexArray = result;
  });

  // Function for submitting flex info to DB
  self.submitFlex = function(){
    console.log(self.flexArray);
    budgetFactory.updateFlexItems(self.flexArray).then(function(result){
      switch (self.budget.budget_status) {
        case "Finished":
        budgetFactory.updateBudgetStatus("Finished");
        break;
        case "Comments":
        budgetFactory.updateBudgetStatus("Comments");
        break;
        case "Financial":
        budgetFactory.updateBudgetStatus("Financial");
        break;
        case "Functional":
        budgetFactory.updateBudgetStatus("Functional");
        break;
        case "Flow":
        budgetFactory.updateBudgetStatus("Flow");
        break;
        case "Flex":
        budgetFactory.updateBudgetStatus("Flex");
        break;
        default:
        budgetFactory.updateBudgetStatus("Flex");
      }
    });
  }; // End: submitFlex

}]); // END: FlexSpendController
