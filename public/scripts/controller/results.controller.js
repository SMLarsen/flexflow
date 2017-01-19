app.controller('ResultsController', ['$http', 'AuthFactory', 'BudgetFactory', 'AdminFactory', 'ReportFactory', function($http, AuthFactory, BudgetFactory, AdminFactory, ReportFactory) {
    console.log('Results controller started');
    var self = this;
    var budgetFactory = BudgetFactory;
    var authFactory = AuthFactory;
    var adminFactory = AdminFactory;
    var reportFactory = ReportFactory;
    var scheduleEmail = adminFactory.getAdminParameter('Scheduling_email');
    var currentUser = authFactory.getCurrentUser();

    self.navActive = false;

    self.activateMobileNav = function() {
        if (self.navActive === false) {
            self.navActive = true;
        } else {
            self.navActive = false;
        }
    };

    budgetFactory.getFlowItemTotalByYear()
           .then(function(results) {
               self.flowTotal = parseInt(results.sum / 12);
               budgetFactory.getFlexItemTotal()
                   .then(function(resultsflex) {
                       self.flexTotal = parseInt(resultsflex.sum);
                       budgetFactory.getFunctionalItemTotal()
                           .then(function(resultsfunc) {
                               self.functionalTotal = parseInt(resultsfunc.sum);
                               budgetFactory.getFinancialItemTotal()
                                   .then(function(resultsfin) {
                                       self.financialTotal = parseInt(resultsfin.sum);
                                       budgetFactory.getBudget()
                                        .then(function(resultsbudg){
                                          self.takeHomeCash = parseInt(resultsbudg.monthly_take_home_amount);
                                          self.totalSpending = self.flowTotal + self.flexTotal + self.functionalTotal + self.financialTotal;
                                          self.netTotal = self.takeHomeCash - self.totalSpending;
                                        });
                                   });
                           });
                   });
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
        var sendObject = {
            displayName: currentUser.displayName,
            email: currentUser.email,
            flowTotal: self.flowTotal,
            flexTotal: self.flexTotal,
            functionalTotal: self.functionalTotal,
            financialTotal: self.financialTotal,
            takeHomeCash: self.takeHomeCash,
            netTotal: self.netTotal
        };
        // console.log("SendObject ", sendObject);

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

        budgetFactory.updateBudgetStatus("Finished").then(function(result){
          authFactory.logOut();
        });
        window.location = '/#/home';
    };

    self.getReportData = function() {
        reportFactory.getReportData()
            .then(function(result) {
                self.reportData = result;
                console.log('Retrieved report data');
            });
    };


}]);
