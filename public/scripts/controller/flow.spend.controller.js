app.controller('FlowSpendController', ['$http', 'AuthFactory', 'TemplateFactory', function($http, AuthFactory, TemplateFactory) {
  console.log('Flow Spend controller started');
  var self = this;
  self.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  self.currentMonth = null;
  self.currentMonthIndex = null;
  self.newFlowBudget = null;
  var templateFactory = TemplateFactory;
  self.flowCategories = templateFactory.getItemTemplate("Flow");

  console.log('flow categories', self.flowCategories);

  self.enterMonthFlowData = function(month, i) {
    console.log('you have clicked', month);
    console.log(i);
    self.currentMonth = month;
    self.currentMonthIndex = i;
    console.log(self.currentMonth);
  }

  self.nextMonth = function() {
    if(self.currentMonthIndex < 11) {
    self.currentMonthIndex++;
  } else {
    self.currentMonthIndex = 0;
  }
    return self.currentMonth = self.months[self.currentMonthIndex];
  }

  self.prevMonth = function() {
    if(self.currentMonthIndex > 0) {
    self.currentMonthIndex--;
  } else {
    self.currentMonthIndex = 11;
  }
    return self.currentMonth = self.months[this.currentMonthIndex];
  }
}]);
