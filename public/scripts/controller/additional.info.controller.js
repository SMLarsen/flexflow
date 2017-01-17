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

  self.postAdditionalInfo = function() {

    var sendObject = {budget_comment: self.comment};

    budgetFactory.postAdditionalInfo(sendObject)
      .then(function(result){
          //console.log('Comment Inserted on Client Side');
          // console.log("in postAdditionalInfo ", sendObject);
          window.location = '/#/results';
      },
      function(err){
        console.log('Error inserting comment for', currentUser.email, ': ', err);
        return;
      }); // end budgetFactory


  };

}]);
