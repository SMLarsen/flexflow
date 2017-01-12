app.controller('ResultsController', ['$http', 'AuthFactory', 'BudgetFactory', function($http, AuthFactory, BudgetFactory) {
    console.log('Results controller started');
    var self = this;
    var budgetFactory = BudgetFactory;

    budgetFactory.getFlowItemTotalByYear().then(function(results) {
        self.flowTotal = results.sum / 12;
    });

    budgetFactory.getFlexItemTotal().then(function(results) {
        self.flexTotal = results.sum;
    });

    budgetFactory.getFunctionalItemTotal().then(function(results) {
        self.functionalTotal = results.sum;
    });

    budgetFactory.getFinancialItemTotal().then(function(results) {
        self.financialTotal = results.sum;
    });

    self.scheduleMeeting = function() {
        console.log('scheduleMeeting clicked');
    };

    self.logOut = function() {
        console.log('logout clicked');
    };

}]);
