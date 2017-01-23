app.controller('NavController', ['BudgetFactory', function(BudgetFactory) {
  console.log('Nav controller started');

  var budgetFactory = BudgetFactory;


  budgetFactory.getBudget().then(function(results){
    self.budgetStatus = results.budget_status;
    switch (self.budgetStatus) {
      case "Finished":
      self.budgetStatusIndex = 6;
      break;
      case "Comments":
      self.budgetStatusIndex = 6;
      break;
      case "Financial":
      self.budgetStatusIndex = 5;
      break;
      case "Functional":
      self.budgetStatusIndex = 4;
      break;
      case "Flow":
      self.budgetStatusIndex = 3;
      break;
      case "Flex":
      self.budgetStatusIndex = 2;
      break;
      case "Profile":
      self.budgetStatusIndex = 1;
      break;
      default:
      self.budgetStatusIndex = 0;
    }
    console.log(self.budgetStatusIndex);
  });



  }]);
