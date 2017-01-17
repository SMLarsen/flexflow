app.controller('ResultsController', ['$http', 'AuthFactory', 'BudgetFactory', 'AdminFactory', function($http, AuthFactory, BudgetFactory, AdminFactory) {
    console.log('Results controller started');
    var self = this;
    var budgetFactory = BudgetFactory;
    var authFactory = AuthFactory;
    var adminFactory = AdminFactory;
    var scheduleEmail = adminFactory.getAdminParameter('Scheduling_email');
    var currentUser = authFactory.getCurrentUser();

    self.navActive = false;

    self.activateMobileNav = function() {
      if(self.navActive === false){
        self.navActive = true;
      } else {
        self.navActive = false;
      }
    };

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
        var sendObject = {
            displayName: currentUser.displayName,
            email: currentUser.email,
            flowTotal: self.flowTotal,
            flexTotal: self.flexTotal,
            functionalTotal: self.functionalTotal,
            financialTotal: self.financialTotal
        };
        console.log("SendObject ", sendObject);

        $http({
                method: 'POST',
                url: '/mail',
                headers: {
                    id_token: authFactory.getIdToken()
                },
                data: sendObject
            })
            .then(function(response) {
                console.log('POST mail succesfully in RESULT page');
                return;
            }, function(err) {
                console.log('Error sending mail in RESULT', currentUser.email, ': ', err);
            });

        authFactory.logOut();
        window.location = '/#/home';
    };

}]);
