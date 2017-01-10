app.controller('FlowSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function($http, AuthFactory, TemplateFactory, BudgetFactory) {
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
  setToggles();

  // enters correct month and month index
  self.enterMonthFlowData = function(month, i) {
    self.currentMonth = month;
    self.currentMonthIndex = i;
  } // end enterMonthFlowData

  // advances to the next month
  self.nextMonth = function() {
    postMonthFlowData();
    clearData();
    setToggles();
    self.newFlowBudget = [];
    self.flowCategories = templateFactory.getItemTemplate("Flow");
    if(self.currentMonthIndex < 11) {
      self.currentMonthIndex++;
    } else {
      self.currentMonthIndex = 0;
    }
    return self.currentMonth = self.months[self.currentMonthIndex];
  } // end nextMonth

  // retreats to previous month
  self.prevMonth = function() {
    postMonthFlowData();
    clearData();
    setToggles();
    self.newFlowBudget = [];
    self.flowCategories = templateFactory.getItemTemplate("Flow");
    if(self.currentMonthIndex > 0) {
      self.currentMonthIndex--;
    } else {
      self.currentMonthIndex = 11;
    }
    return self.currentMonth = self.months[this.currentMonthIndex];
  } // end prevMonth

  // toggles activeCategory value for each category
  self.toggleActive = function(category) {
    if(category.activeCategory === false) {
      category.activeCategory = true;
    } else {
      category.activeCategory = false;
    }
  } // end toggleActive

  function clearData() {
    for (var i = 0; i < self.flowCategories.length; i++) {
      var category = self.flowCategories[i];
      if(category.item_amount != undefined) {
        category.item_amount = undefined;
      }
    }
  } // end clearData

  // removes all active values in individual flow categories
  function setToggles(){
    for (var i = 0; i < self.flowCategories.length; i++) {
      var category = self.flowCategories[i];
      if(category.item_amount === undefined || category.item_amount === 0) {
        category.activeCategory  = false;
      } else {
        category.activeCategory = true;
      }
    }
  } // end setToggles

  // restructuring monthly flow data for database
  function postMonthFlowData() {
    for (var i = 0; i < self.flowCategories.length; i++) {
      if(self.flowCategories[i].item_amount === undefined) {
        self.flowCategories[i].item_amount = 0;
      }
      var monthlyBudgetCategoryData = {
        item_month: self.currentMonthIndex + 1,
        item_year: 2017,
        item_name: self.flowCategories[i].item_name,
        item_amount: parseInt(self.flowCategories[i].item_amount)
      };
      self.newFlowBudget[i] = monthlyBudgetCategoryData;
    }
  } // end postMonthFlowData

}]); //end flow controller
