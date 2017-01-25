app.factory("ReportFactory", function($http, AuthFactory) {
    // console.log('ReportFactory started');

    var authFactory = AuthFactory;

    reportData = {};
    monthHeadings = [];

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

    var budgetMonths = [];
    var startingMonthIndex = 0;
    var startingMonthID = 0;
    var startingYear = 0;

      function setStartingMonth() {
        var startingMonthIndex = startingMonthID - 1;
        for (var i = 0; i < allMonths.length; i++) {
          if(i >= startingMonthIndex) {
            budgetMonths.push(allMonths[i]);
          }
        }
        for (var i = 0; i < allMonths.length; i++) {
          if(i < startingMonthIndex) {
            budgetMonths.push(allMonths[i]);
          }
        }
      } // end setStartingMonth

      // sets years of months
      function setYears() {
        if(budgetMonths[0].month === 'January') {
          for (var i = 0; i < budgetMonths.length; i++) {
            budgetMonths[i].year = startingYear;
          }
        } else {
          var newYear = false;
          for (var i = 0; i < budgetMonths.length; i++) {
            if(newYear === false && budgetMonths[i].month != 'January') {
              newYear = false;
              budgetMonths[i].year = startingYear;
            } else if (newYear === false && budgetMonths[i].month === 'January') {
              newYear = true;
              budgetMonths[i].year = startingYear + 1;
            } else {
              budgetMonths[i].year = startingYear + 1;
            }
          }
        }
      } // end setYears


    getReportData = function() {
        return $http({
                method: 'GET',
                url: '/client-report',
                headers: {
                    id_token: authFactory.getIdToken()
                }
            })
            .then(function(response) {
                    reportData = response.data;
                    console.log('Report data:', reportData);
                    startingMonthID = reportData.profile.budget_start_month;
                    startingYear = reportData.profile.budget_start_year;
                    setStartingMonth();
                    setYears();
                    console.log(budgetMonths);
                    return reportData;
                },
                function(err) {
                    console.log('Error getting report data ', err);
                    return;
                });
    }; //end getReportData

  function formatMonthHeadings() {

  }

    var publicApi = {
        getReportData: function() {
            return getReportData();
        }
    };

    return publicApi;

}); // END: ReportFactory
