app.controller('FlexSpendController', ['BudgetFactory', function(BudgetFactory) {
    // console.log('Flex Spend controller started');

    var self = this;

    var budgetFactory = BudgetFactory;

    budgetFactory.getBudget().then(function(results) {
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
        budgetFactory.updateFlexItems(self.flexArray).then(function(result) {
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
