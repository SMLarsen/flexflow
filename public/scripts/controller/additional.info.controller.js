app.controller('AdditionalInfoController', ['$http', 'AuthFactory', 'BudgetFactory', function($http, AuthFactory, BudgetFactory) {
  console.log('Additional Info controller started');

  var self = this;
  var budgetFactory = BudgetFactory;

  self.postAdditionalInfo = function(){
    var sendObject = {budget_comment: self.comment};

    budgetFactory.postAdditionalInfo(sendObject)
      .then(function(result){
          //console.log('Comment Inserted on Client Side');
          // console.log("in postAdditionalInfo");
          window.location = '/#/results';
      },
      function(err){
        console.log('Error inserting comment for', currentUser.email, ': ', err);
        return;
      }); // end budgetFactory

  };

}]);
