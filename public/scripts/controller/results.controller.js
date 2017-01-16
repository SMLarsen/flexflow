app.controller('ResultsController', ['$http', 'AuthFactory', 'BudgetFactory', 'AdminFactory', function($http, AuthFactory, BudgetFactory, AdminFactory) {
    console.log('Results controller started');
    var self = this;
    var budgetFactory = BudgetFactory;
    var authFactory = AuthFactory;
    var adminFactory = AdminFactory;
    var scheduleEmail = adminFactory.getAdminParameter('Scheduling_email');
    var currentUser = authFactory.getCurrentUser();

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
        var link = "mailto:" + scheduleEmail +
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
