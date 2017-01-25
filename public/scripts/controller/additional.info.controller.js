app.controller('AdditionalInfoController', ['BudgetFactory', function(BudgetFactory) {
// console.log('Additional Info controller started');

  var self = this;

  var budgetFactory = BudgetFactory;

  self.navActive = false;

  self.activateMobileNav = function() {
    if(self.navActive === false){
      self.navActive = true;
    } else {
      self.navActive = false;
    }
  };


  budgetFactory.getBudget().then(function(results){
    self.budget = results;
    self.budgetStatus = self.budget.budget_status;
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
  });

    budgetFactory.getAdditionalInfo()
        .then(function(result) {
                var length = result.data.length;
                if (length > 0) {
                    self.comment = result.data[length-1].budget_comment;
                }
            },
            function(err) {
                console.log('Error getting comment for', currentUser.email, ': ', err);
            }
        );



    self.postAdditionalInfo = function() {

        var sendObject = {
            budget_comment: self.comment
        };

        budgetFactory.postAdditionalInfo(sendObject)
            .then(function(result) {
                    budgetFactory.updateBudgetStatus("Comments");
                    window.location = '/#/results';
                },
                function(err) {
                    console.log('Error inserting comment for', currentUser.email, ': ', err);
                    return;
                });
    };



}]);
