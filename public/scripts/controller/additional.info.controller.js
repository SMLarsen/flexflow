app.controller('AdditionalInfoController', ['BudgetFactory', function(BudgetFactory) {
    console.log('Additional Info controller started');

    var self = this;

    var budgetFactory = BudgetFactory;

    self.navActive = false;

    self.activateMobileNav = function() {
        if (self.navActive === false) {
            self.navActive = true;
        } else {
            self.navActive = false;
        }
    };

    budgetFactory.getAdditionalInfo()
        .then(function(result) {
                //console.log("I'm here in getAdditionalInfo controller");
                // console.log("result ", result.data[0].budget_comment);
                var length = result.data.length;
                console.log("length in AddiontalInfo ", length);
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
                    //console.log('Comment Inserted on Client Side');
                    // console.log("in postAdditionalInfo ", sendObject);
                    window.location = '/#/results';
                },
                function(err) {
                    console.log('Error inserting comment for', currentUser.email, ': ', err);
                    return;
                });
    };



}]);
