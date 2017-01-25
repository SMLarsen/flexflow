/*jshint esversion: 6 */
app.controller('ResultsController', ['$http', 'AuthFactory', 'BudgetFactory', 'AdminFactory', function($http, AuthFactory, BudgetFactory, AdminFactory) {
    // console.log('Results controller started');
    let self = this;
    const budgetFactory = BudgetFactory;
    const authFactory = AuthFactory;
    const adminFactory = AdminFactory;
    const scheduleEmail = adminFactory.getAdminParameter('Scheduling_email');
    const currentUser = authFactory.getCurrentUser();

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
                                        .then(function(resultsbudg) {
                                            self.takeHomeCash = parseInt(resultsbudg.monthly_take_home_amount);
                                            self.totalSpending = self.flowTotal + self.flexTotal + self.functionalTotal + self.financialTotal;
                                            self.netTotal = self.takeHomeCash - self.totalSpending;
                                        });
                                });
                        });
                });
        });

    self.scheduleMeeting = function() {
        let link = "mailto:" + adminFactory.getAdminParameter('Scheduling_email') +
            "?cc=" + currentUser.email +
            "&subject=" + escape("Financial Planning Meeting Request") +
            "&body=" + escape("I would like to schedule a meeting");
        window.location.href = link;
    };

    self.logOut = function() {
        let sendObject = {
            displayName: currentUser.displayName,
            email: currentUser.email,
            flowTotal: self.flowTotal,
            flexTotal: self.flexTotal,
            functionalTotal: self.functionalTotal,
            financialTotal: self.financialTotal,
            takeHomeCash: self.takeHomeCash,
            netTotal: self.netTotal
        };

        $http({
                method: 'POST',
                url: '/csv',
                headers: {
                    id_token: authFactory.getIdToken()
                },
                data: sendObject
            })
            .then(function(response) {
                // console.log('POST mail successful for CSV');
                return;
            }, function(err) {
                console.log('Error sending mail in CSV RESULT', currentUser.email, ': ', err);
            });

        $http({
                method: 'POST',
                url: '/client-report',
                headers: {
                    id_token: authFactory.getIdToken()
                },
                data: sendObject

            })
            .then(function(response) {
                // console.log('POST mail successful for PDF');
                return;
            }, function(err) {
                console.log('Error sending mail in PDF RESULT', currentUser.email, ': ', err);
            });

        budgetFactory.updateBudgetStatus("Finished").then(function(result) {
            authFactory.logOut();
        });
        window.location = '/#/home';
    };

    self.getReportData = function() {
        reportFactory.getReportData()
            .then(function(result) {
                self.reportData = result;
            });
    };


}]);
