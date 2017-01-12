app.controller('FlowSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function($http, AuthFactory, TemplateFactory, BudgetFactory) {
  console.log('Flow Spend controller started');
  var self = this;
  var allMonths = [
    {month: 'January',
    year: 0,
    month_id: 1},
    {month: 'February',
    year: 0,
    month_id: 2},
    {month: 'March',
    year: 0,
    month_id: 3},
    {month: 'April',
    year: 0,
    month_id: 4},
    {month: 'May',
    year: 0,
    month_id: 5},
    {month: 'June',
    year: 0,
    month_id: 6},
    {month: 'July',
    year: 0,
    month_id: 7},
    {month: 'August',
    year: 0,
    month_id: 8},
    {month: 'September',
    year: 0,
    month_id: 9},
    {month: 'October',
    year: 0,
    month_id: 10},
    {month: 'November',
    year: 0,
    month_id: 11},
    {month: 'December',
    year: 0,
    month_id: 12},
  ];
  self.budgetMonths = [];
  self.startingMonthID = 0;
  self.monthID = 0;
  self.startingMonth = '';
  self.startingYear = null;
  self.currentMonth = null;
  self.currentMonthIndex = null;
  self.monthBudgetData = [];
  self.newFlowBudget = [];
  var templateFactory = TemplateFactory;
  var budgetFactory = BudgetFactory;

  self.getFlowItems = function() {
    budgetFactory.getFlowItems()
    .then(function(result) {
      console.log(result);
      self.flowCategories = result;
      setToggles();
    });
  };

  self.updateFlowItems = function() {
    console.log('update flow items clicked');
    budgetFactory.updateFlowItems(self.flowItemArray);
  };


  // get initial budget data
  getBudgetData();

  // // getting flow items
  self.getFlowItems();

  // enters correct month and month index
  self.enterMonthFlowData = function(month, i) {
    self.currentMonthData = month;
    self.currentMonth = month.month;
    self.currentMonthIndex = month.month_id;
    self.currentYear = month.year;
  } // end enterMonthFlowData

  // advances to the next month
  self.nextMonth = function() {
    postMonthFlowData();
    // self.updateFlowItems(self.newFlowBudget);
    // clearData();
    setToggles();
    self.monthBudgetData = [];
    setNextMonthData();
  } // end nextMonth

  // retreats to previous month
  self.prevMonth = function() {
    postMonthFlowData();
    // self.updateFlowItems(self.newFlowBudget);
    // clearData();
    setToggles();
    self.monthBudgetData = [];
    setPrevMonthData();
  } // end prevMonth

  // reverts to previous flex spending page
  self.prevPage = function() {
    window.location = '/#/flexspend'
  } // end prevPage

  // advances to functional spending page
  self.nextPage = function() {
    window.location = '/#/functionalspend'
  } // end nextPage

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
        item_month: self.currentMonthIndex,
        item_year: self.currentYear,
        item_name: self.flowCategories[i].item_name,
        item_amount: parseInt(self.flowCategories[i].item_amount)
      };
      self.newFlowBudget[i] = monthlyBudgetCategoryData;
    }
  } // end postMonthFlowData

  // gets initial budget data
  function getBudgetData() {
    budgetFactory.getBudget().then(function(response) {
      var budget = response;
      self.startingMonthID = budget.budget_start_month;
      self.startingYear = budget.budget_start_year;
      setStartingMonth();
      setYears();
    });
  } //end getBudgetData

  function setStartingMonth() {
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

  // function to reset index and data when advancing a month
  function setNextMonthData() {
    if(self.currentMonthIndex < 12) {
      self.currentMonthIndex++;
    } else {
      self.currentMonthIndex = 1;
    }

    for (var i = 0; i < self.budgetMonths.length; i++) {
      if(self.currentMonthIndex == self.budgetMonths[i].month_id) {
        self.currentMonthData = self.budgetMonths[i];
        self.currentMonth = self.budgetMonths[i].month;
      }
    }
  } // end setNextMonthData

  // function to reset index and data when regressing to the previous month
  function setPrevMonthData() {
    if(self.currentMonthIndex > 1) {
      self.currentMonthIndex--;
    } else {
      self.currentMonthIndex = 12;
    }

    for (var i = 0; i < self.budgetMonths.length; i++) {
      if(self.currentMonthIndex == self.budgetMonths[i].month_id) {
        self.currentMonthData = self.budgetMonths[i];
        self.currentMonth = self.budgetMonths[i].month;
      }
    }
  } // end setPrevMonthData

}]); //end flow controller
