app.controller('ReportController', ['$http', 'AuthFactory', function($http, AuthFactory) {
    console.log('Report controller started');
    var self = this;
    var authFactory = AuthFactory;


    self.reportData = {};
    self.monthHeadings = [];

    var allMonths = [
      {month: 'January',
      year: 0,
      month_id: 1,
      month_total: null},
      {month: 'February',
      year: 0,
      month_id: 2,
      month_total: null},
      {month: 'March',
      year: 0,
      month_id: 3,
      month_total: null},
      {month: 'April',
      year: 0,
      month_id: 4,
      month_total: null},
      {month: 'May',
      year: 0,
      month_id: 5,
      month_total: null},
      {month: 'June',
      year: 0,
      month_id: 6,
      month_total: null},
      {month: 'July',
      year: 0,
      month_id: 7,
      month_total: null},
      {month: 'August',
      year: 0,
      month_id: 8,
      month_total: null},
      {month: 'September',
      year: 0,
      month_id: 9,
      month_total: null},
      {month: 'October',
      year: 0,
      month_id: 10,
      month_total: null},
      {month: 'November',
      year: 0,
      month_id: 11,
      month_total: null},
      {month: 'December',
      year: 0,
      month_id: 12,
      month_total: null},
    ];

      function setStartingMonth() {
        self.budgetMonths = [];
        var startingMonthIndex = self.startingMonthID - 1;
        for (var i = 0; i < allMonths.length; i++) {
          if(i >= startingMonthIndex) {
            self.budgetMonths.push(allMonths[i]);
          }
        }
        for (var i = 0; i < allMonths.length; i++) {
          if(i < startingMonthIndex) {
            self.budgetMonths.push(allMonths[i]);
          }
        }
      } // end setStartingMonth

      // sets years of months
      function setYears() {
        if(self.budgetMonths[0].month === 'January') {
          for (var i = 0; i < self.budgetMonths.length; i++) {
            self.budgetMonths[i].year = self.startingYear;
          }
        } else {
          var newYear = false;
          for (var i = 0; i < self.budgetMonths.length; i++) {
            if(newYear === false && self.budgetMonths[i].month != 'January') {
              newYear = false;
              self.budgetMonths[i].year = self.startingYear;
            } else if (newYear === false && self.budgetMonths[i].month === 'January') {
              newYear = true;
              self.budgetMonths[i].year = self.startingYear + 1;
            } else {
              self.budgetMonths[i].year = self.startingYear + 1;
            }
          }
        }
      } // end setYears


    self.getReportData = function() {
        $http({
                method: 'GET',
                url: '/client-report',
                headers: {
                    id_token: authFactory.getIdToken()
                }
            })
            .then(function(response) {
                    self.reportData = response.data;
                    console.log('Report data:', self.reportData);
                    self.startingMonthID = self.reportData.profile.budget_start_month;
                    self.startingYear = self.reportData.profile.budget_start_year;
                    setStartingMonth();
                    setYears();
                    console.log(self.budgetMonths);
                    return;
                },
                function(err) {
                    console.log('Error getting report data ', err);
                    return;
                });
    }; //end getReportData

function formatMonthHeadings() {

}

}]);
