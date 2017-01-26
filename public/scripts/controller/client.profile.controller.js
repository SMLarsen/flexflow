app.controller('ClientProfileController', ['BudgetFactory', function(BudgetFactory) {
    // console.log('Client Profile controller started');

    var self = this;

    var budgetFactory = BudgetFactory;

    self.budget = {};
    self.flexArray = [];
    self.numPeople = 0;
    self.savings = undefined;
    self.monthSavings = undefined;
    self.navActive = false;

    var currentTime = new Date();

    var year = currentTime.getFullYear();
    self.nextFiveYears = [];

    self.activateMobileNav = function() {
        if (self.navActive === false) {
            self.navActive = true;
        } else {
            self.navActive = false;
        }
    };

    // console.log(year);
    getYears();

    // Function to build array of people in flex budget
    var buildFlexArray = function(number) {
        self.flexArray = [];
        for (var i = 0; i < number; i++) {
            self.flexArray.push({
                item_name: null,
                item_amount: null,
                item_sort_sequence: i + 1
            });
        }
    }; // End: buildFlexArray

    // Function for selecting number of adults in household
    self.clickNumPeople = function(number) {
        self.numPeople = number;
        buildFlexArray(self.numPeople);
    }; // End: clickNumPeople

    // Function for posting salary info to DB
    self.postBudget = function() {
        // self.budget.meeting_scheduled = false;
        switch (self.budget.budget_status) {
            case "Finished":
                self.budget.budget_status = "Finished";
                break;
            case "Comments":
                self.budget.budget_status = "Comments";
                break;
            case "Financial":
                self.budget.budget_status = "Financial";
                break;
            case "Functional":
                self.budget.budget_status = "Functional";
                break;
            case "Flow":
                self.budget.budget_status = "Flow";
                break;
            case "Flex":
                self.budget.budget_status = "Flex";
                break;
            case "Profile":
                self.budget.budget_status = "Profile";
                break;
            default:
                self.budget.budget_status = "Profile";

        }
        budgetFactory.postBudget(self.budget)
            .then(function(budgetResponse) {
                budgetFactory.postFlexItems(self.flexArray)
                    .then(function(flexResponse) {
                        budgetFactory.getBudget()
                            .then(function(getResponse) {
                                self.budget = getResponse;
                                self.savings = parseInt(self.budget.annual_salary) * 0.20;
                                self.monthSavings = parseInt(self.savings) / 12;
                            });

                    });
            });
    }; // End: postBudget

    // Function to get current years for selecting budget start date
    function getYears() {
        self.nextFiveYears.push(year);
        for (var i = 0; i < 4; i++) {
            year++;
            self.nextFiveYears.push(year);
        }
    } // End: getYears

}]); // END: ClientProfileController
