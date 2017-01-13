app.controller('ResultsController', ['$http', 'AuthFactory', 'BudgetFactory', function($http, AuthFactory, BudgetFactory) {
    console.log('Results controller started');
    var self = this;
    var budgetFactory = BudgetFactory;
    var authFactory = AuthFactory;
    var currentUser = authFactory.getCurrentUser();
    console.log('results email:', currentUser);

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
        var link = "mailto:" + "isaiah@becomingfinancial.com" +
            "?cc=" + currentUser.email +
            "&subject=" + escape("Financial Planning Meeting Request") +
            "&body=" + escape("I would like to schedule a meeting");
        window.location.href = link;
    };

    self.logOut = function() {
        console.log('logout clicked');
        authFactory.logOut();
        window.location = '/#/home';
    };

}]);
