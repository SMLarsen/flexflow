app.controller('FlowSpendController', ['$http', 'AuthFactory', 'TemplateFactory', function($http, AuthFactory, TemplateFactory) {
  console.log('Flow Spend controller started');
  var self = this;
  this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  this.currentMonth = null;
  this.currentMonthIndex = null;
  this.flowCategories = TemplateFactory.getItemTemplate('Flow');
  console.log(this.flowCategories);


  this.enterMonthFlowData = function(month, i) {
    console.log('you have clicked', month);
    console.log(i);
    this.currentMonth = month;
    this.currentMonthIndex = i;
    console.log(this.currentMonth);
  }

  this.nextMonth = function() {
    if(this.currentMonthIndex < 11) {
    this.currentMonthIndex++;
  } else {
    this.currentMonthIndex = 0;
  }
    return this.currentMonth = this.months[this.currentMonthIndex];
  }

  this.prevMonth = function() {
    if(this.currentMonthIndex > 0) {
    this.currentMonthIndex--;
  } else {
    this.currentMonthIndex = 11;
  }
    return this.currentMonth = this.months[this.currentMonthIndex];
  }
}]);
