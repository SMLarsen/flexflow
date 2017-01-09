app.controller('FlowSpendController', ['$http', 'AuthFactory', 'TemplateFactory', function($http, AuthFactory, TemplateFactory) {
  console.log('Flow Spend controller started');
  var self = this;
  this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  this.currentMonth = null;

  this.enterMonthFlowData = function(month) {
    console.log('you have clicked', month);
    this.currentMonth = month;
    console.log(this.currentMonth);
  }
}]);
