(function () {
    app.controller('WelcomeController', ['$http', 'AuthFactory', 'BudgetFactory', function ($http, AuthFactory, BudgetFactory) {
        console.log('WelcomeController started');
        var self = this;
        var authFactory = AuthFactory;
        var budgetFactory = BudgetFactory;
        var newUser = authFactory.isNewUser();
        // budget profile for testing
        var testProfile = {
            budget_start_month: 03,
            budget_start_year: 2017,
            monthly_take_home_amount: 10000,
            annual_salary: 200000,
            meeting_scheduled: true
        };
        if (!newUser) {
            budgetFactory.getBudget()
                .then(function (result) {
                    self.budget = result;
                    // console.log('WelcomeController budget', self.budget);
                });
        }
        self.postBudget = function () {
            console.log('post clicked');
            budgetFactory.postBudget(self.budget)
                .then(function (result) {
                        console.log('Profile inserted');
                        return;
                    },
                    function (err) {
                        console.log('Error inserting profile for', currentUser.email, ': ', err);
                        return;
                    });
        };
        self.updateBudget = function () {
            console.log('update clicked');
            budgetFactory.updateBudget(self.budget)
                .then(function (result) {
                        console.log('Profile updated');
                        return;
                    },
                    function (err) {
                        console.log('Error updating profile for', currentUser.email, ': ', err);
                        return;
                    });
        };
        // ************************* flow items functions  ****************************
        self.getFlowItems = function () {
            budgetFactory.getFlowItems()
                .then(function (result) {
                    self.flowItemArray = result;
                    // console.log('WelcomeController flowItemArray', self.flowItemArray);
                });
        };
        //self.getFlowItems();
        //console.log('here in self.flowItemArray');
        // console.log(self.flowItemArray);
        // Dummy data for testing
        // var flowMonth = [{
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 0,
        //         item_name: 'Holidays'
        //     },
        //     {
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 50,
        //         item_name: 'Cash (Other / Random)'
        //     },
        //     {
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 40,
        //         item_name: 'Car/Home Maintenance'
        //     },
        //     {
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 0,
        //         item_name: 'Birthdays'
        //     },
        //     {
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 50,
        //         item_name: 'Stuff for Kids'
        //     },
        //     {
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 0,
        //         item_name: 'Trips/ Vacation'
        //     },
        //     {
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 0,
        //         item_name: 'Auto Registration'
        //     },
        //     {
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 150,
        //         item_name: 'Personal Care'
        //     },
        //     {
        //         item_month: 1,
        //         item_year: 2017,
        //         item_amount: 0,
        //         item_name: 'P&C Insurance'
        //     }
        // ];
        self.postFlowItems = function () {
            console.log('post flow items clicked');
            budgetFactory.postFlowItems(self.flowItemArray)
                .then(function (result) {
                        console.log('Flow items inserted');
                        return;
                    },
                    function (err) {
                        console.log('Error inserting flow items for', currentUser.email, ': ', err);
                        return;
                    });
        };
        self.updateFlowItems = function () {
            console.log('update flow items clicked');
            budgetFactory.updateFlowItems(self.flowItemArray);
        };
        // ************************* flex items functions  ****************************
        self.getFlexItems = function () {
            console.log("getFlexItems clicked");
            budgetFactory.getFlexItems()
                .then(function (result) {
                    self.flexItemArray = result;
                    // console.log('WelcomeController flexItemArray', self.flexItemArray);
                });
        };
        // Dummy data for testing
        // var flexArray = [{
        //         flex_amount: 500,
        //         flex_name: 'Bill'
        //     },
        //     {
        //         flex_amount: 250,
        //         flex_name: 'Bev'
        //     }
        // ];
        self.postFlexItems = function () {
            console.log('post flex items clicked');
            budgetFactory.postFlexItems(self.flexItemArray)
                .then(function (result) {
                        console.log('Flex items inserted');
                        return;
                    },
                    function (err) {
                        console.log('Error inserting flex items for', currentUser.email, ': ', err);
                        return;
                    });
        };
        self.updateFlexItems = function () {
            console.log('update flex items clicked');
            budgetFactory.updateFlexItems(self.flexItemArray);
        };
        // ************************* functional items functions  ****************************
        self.getFunctionalItems = function () {
            budgetFactory.getFunctionalItems()
                .then(function (result) {
                    self.functionalItemArray = result;
                    // console.log('WelcomeController functionalItemArray', self.functionalItemArray);
                });
        };
        // Dummy data for testing
        // var functionalArray = [{
        //         item_amount: 1000,
        //         item_name: 'Rent | Mortgage'
        //     },
        //     {
        //         item_amount: 500,
        //         item_name: 'Daycare'
        //     },
        //     {
        //         item_amount: 40,
        //         item_name: 'Cars'
        //     },
        //     {
        //         item_amount: 150,
        //         item_name: 'P&C Insurance'
        //     },
        //     {
        //         item_amount: 150,
        //         item_name: 'Cell Phone'
        //     },
        //     {
        //         item_amount: 200,
        //         item_name: 'Utilities'
        //     },
        //     {
        //         item_amount: 150,
        //         item_name: 'Student Loans'
        //     },
        //     {
        //         item_amount: 150,
        //         item_name: 'Credit Card | Loans'
        //     },
        //     {
        //         item_amount: 110,
        //         item_name: 'Gas'
        //     }
        // ];
        self.postFunctionalItems = function () {
            console.log('post functional items clicked');
            // budgetFactory.postFunctionalItems(functionalArray)
            budgetFactory.postFunctionalItems(self.funtionalItemArray)
                .then(function (result) {
                        console.log('Functional items inserted');
                        return;
                    },
                    function (err) {
                        console.log('Error inserting functional items for', currentUser.email, ': ', err);
                        return;
                    });
        };
        self.updateFunctionalItems = function () {
            console.log('update functional items clicked');
            budgetFactory.updateFunctionalItems(self.functionalItemArray);
        };
        // ************************* financial items functions  ****************************
        self.getFinancialItems = function () {
            budgetFactory.getFinancialItems()
                .then(function (result) {
                    self.financialItemArray = result;
                    // console.log('WelcomeController financialItemArray', self.financialItemArray);
                });
        };
        // Dummy data for testing
        // var financialArray = [{
        //         item_amount: 300,
        //         item_name: 'Insurance'
        //     },
        //     {
        //         item_amount: 500,
        //         item_name: 'Investments'
        //     },
        //     {
        //         item_amount: 400,
        //         item_name: 'Emergency Cash'
        //     }
        // ];
        self.postFinancialItems = function () {
            console.log('post financial items clicked');
            budgetFactory.postFinancialItems(self.financialItemArray)
                .then(function (result) {
                        console.log('Financial items inserted');
                        return;
                    },
                    function (err) {
                        console.log('Error inserting financial items for', currentUser.email, ': ', err);
                        return;
                    });
        };
        self.updateFinancialItems = function () {
            console.log('update financial items clicked');
            budgetFactory.updateFinancialItems(self.financialItemArray);
        };
        self.getFlowItemTotalsByMonth = function () {
            budgetFactory.getFlowItemTotalsByMonth().then(function (result) {
                self.flowTotalsByMonth = result;
            });
        };
        self.getFlowItemTotalByYear = function () {
            budgetFactory.getFlowItemTotalByYear().then(function (result) {
                self.flowTotalByYear = result;
            });
        };
        self.getFlexItemTotal = function () {
            budgetFactory.getFlexItemTotal().then(function (result) {
                self.flexItemTotal = result;
            });
        };
        self.getFunctionalItemTotal = function () {
            budgetFactory.getFunctionalItemTotal().then(function (result) {
                self.functionalItemTotal = result;
            });
        };
        self.getFinancialItemTotal = function () {
            budgetFactory.getFinancialItemTotal().then(function (result) {
                self.financialItemTotal = result;
            });
        };
    }]);
})();
