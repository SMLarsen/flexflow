app.controller('FlowSpendController', ['$http', 'AuthFactory', 'TemplateFactory', function($http, AuthFactory, TemplateFactory) {
  console.log('Flow Spend controller started');
  var self = this;
  self.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  self.currentMonth = null;
  self.currentMonthIndex = null;
  self.newFlowBudget = [];
  var templateFactory = TemplateFactory;
  self.flowCategories = templateFactory.getItemTemplate("Flow");

  console.log('flow categories', self.flowCategories);

  // adding false value to flowCategories
  removeActiveToggles();

  // enters correct month and month index
  self.enterMonthFlowData = function(month, i) {
    self.currentMonth = month;
    self.currentMonthIndex = i;
  }

  // advances to the next month
  self.nextMonth = function() {
    console.log(self.flowCategories);
    removeActiveToggles();
    if(self.currentMonthIndex < 11) {
      self.currentMonthIndex++;
    } else {
      self.currentMonthIndex = 0;
    }
    return self.currentMonth = self.months[self.currentMonthIndex];
  }

  // retreats to previous month
  self.prevMonth = function() {
    removeActiveToggles();
    if(self.currentMonthIndex > 0) {
      self.currentMonthIndex--;
    } else {
      self.currentMonthIndex = 11;
    }
    return self.currentMonth = self.months[this.currentMonthIndex];
  }

  // toggles activeCategory value for each category
  self.toggleActive = function(category) {
    if(category.activeCategory === false) {
      category.activeCategory = true;
    } else {
      category.activeCategory = false;
    }
  }

  // removes all active values in individual flow categories
  function removeActiveToggles(){
    for (var i = 0; i < self.flowCategories.length; i++) {
      var category = self.flowCategories[i];
      category.activeCategory = false;
    }
  }
}]);
