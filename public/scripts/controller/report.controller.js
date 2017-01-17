app.controller('ReportController', ['$http', 'AuthFactory', function($http, AuthFactory) {
    console.log('Report controller started');
    var self = this;
    var authFactory = AuthFactory;


    self.reportData = {};

    self.getReportData = function() {
        return $http({
                method: 'GET',
                url: '/client-report',
                headers: {
                    id_token: authFactory.getIdToken()
                }
            })
            .then(function(response) {
                    self.reportData = response.data;
                    console.log('Report data:', self.reportData);
                    return;
                },
                function(err) {
                    console.log('Error getting report data ', err);
                    return;
                });
    }; //end getReportData

}]);
