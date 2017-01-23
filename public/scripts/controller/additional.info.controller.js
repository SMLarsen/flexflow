app.controller('AdditionalInfoController', ['BudgetFactory', function(BudgetFactory) {
  console.log('Additional Info controller started');

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
    .then(function(result){
      //console.log("I'm here in getAdditionalInfo controller");
      // console.log("result ", result.data[0].budget_comment);
      self.comment = result.data[0].budget_comment;
    },
    function(err){
      console.log('Error getting comment for', currentUser.email, ': ', err);
    }
  );


  self.postAdditionalInfo = function() {

    var sendObject = {budget_comment: self.comment};

    budgetFactory.postAdditionalInfo(sendObject)
      .then(function(result){
        switch (self.budget.budget_status) {
          case "Finished":
          budgetFactory.updateBudgetStatus("Finished");
          break;
          case "Comments":
          budgetFactory.updateBudgetStatus("Comments");
          break;
          default:
          budgetFactory.updateBudgetStatus("Comments");
        }
          //console.log('Comment Inserted on Client Side');
          // console.log("in postAdditionalInfo ", sendObject);
          window.location = '/#/results';
      },
      function(err){
        console.log('Error inserting comment for', currentUser.email, ': ', err);
        return;
      });
  };



}]);
