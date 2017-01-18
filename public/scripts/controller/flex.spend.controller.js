app.controller('FlexSpendController', ['BudgetFactory', function(BudgetFactory) {
    console.log('Flex Spend controller started');

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

    budgetFactory.getFlexItems().then(function(result) {
        self.flexArray = result;
    });

    // Function for submitting flex info to DB
    self.submitFlex = function() {
        console.log(self.flexArray);
        budgetFactory.updateFlexItems(self.flexArray);
    }; // End: submitFlex

}]); // END: FlexSpendController
