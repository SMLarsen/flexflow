app.controller('FlowSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function($http, AuthFactory, TemplateFactory, BudgetFactory) {
  console.log('Flow Spend controller started');
  var self = this;
  var allMonths = [
    {month: 'January',
    year: 0},
    {month: 'February',
    year: 0},
    {month: 'March',
    year: 0},
    {month: 'April',
    year: 0},
    {month: 'May',
    year: 0},
    {month: 'June',
    year: 0},
    {month: 'July',
    year: 0},
    {month: 'August',
    year: 0},
    {month: 'September',
    year: 0},
    {month: 'October',
    year: 0},
    {month: 'November',
    year: 0},
    {month: 'December',
    year: 0},
  ];
  self.budgetMonths = [];
  self.startingMonthID = 0;
  self.monthID = 0;
  self.startingMonth = '';
  self.startingYear = null;
  self.currentMonth = null;
  self.currentMonthIndex = null;
  self.newFlowBudget = [];
  var templateFactory = TemplateFactory;
  var budgetFactory = BudgetFactory;
  var authFactory = AuthFactory;
  self.flowCategories = templateFactory.getItemTemplate("Flow");

  // check user state
  var newUser = authFactory.isNewUser();

  console.log(newUser);


  // get initial budget data
  getBudgetData();

  // setting up flowCategories
  setUpFlow(newUser);

  // enters correct month and month index
  self.enterMonthFlowData = function(month, i) {
    self.currentMonth = month.month;
    self.currentMonthIndex = i;
    self.currentYear = month.year;
  } // end enterMonthFlowData

  // advances to the next month
  self.nextMonth = function() {
    postMonthFlowData();
    self.postFlowItems(self.newFlowBudget);
    clearData();
    setToggles();
    self.newFlowBudget = [];
    self.flowCategories = templateFactory.getItemTemplate("Flow");
    if(self.currentMonthIndex < 11) {
      self.currentMonthIndex++;
      self.currentYear = self.budgetMonths[self.currentMonthIndex].year;
    } else {
      self.currentMonthIndex = 0;
      self.currentYear = self.budgetMonths[self.currentMonthIndex].year;
    }
    return self.currentMonth = self.budgetMonths[self.currentMonthIndex].month;
  } // end nextMonth

  // retreats to previous month
  self.prevMonth = function() {
    postMonthFlowData();
    self.postFlowItems(self.newFlowBudget);
    clearData();
    setToggles();
    self.newFlowBudget = [];
    self.flowCategories = templateFactory.getItemTemplate("Flow");
    if(self.currentMonthIndex > 0) {
      self.currentMonthIndex--;
      self.currentYear = self.budgetMonths[self.currentMonthIndex].year;
    } else {
      self.currentMonthIndex = 11;
      self.currentYear = self.budgetMonths[self.currentMonthIndex].year;
    }
    return self.currentMonth = self.budgetMonths[this.currentMonthIndex].month;
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
    if(newUser ===true) {
      for (var i = 0; i < self.flowCategories.length; i++) {
        var category = self.flowCategories[i];
        if(category.item_amount === undefined || category.item_amount === 0) {
          category.activeCategory  = false;
        } else {
          category.activeCategory = true;
        }
      }
    } else {
      
    }
  } // end setToggles

  // restructuring monthly flow data for database
  function postMonthFlowData() {
    findMonthID();
    for (var i = 0; i < self.flowCategories.length; i++) {
      if(self.flowCategories[i].item_amount === undefined) {
        self.flowCategories[i].item_amount = 0;
      }
      var monthlyBudgetCategoryData = {
        item_month: self.monthID,
        item_year: self.currentYear,
        item_name: self.flowCategories[i].item_name,
        item_amount: parseInt(self.flowCategories[i].item_amount)
      };
      self.newFlowBudget[i] = monthlyBudgetCategoryData;
      console.log(self.newFlowBudget);
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

  // function sortflowItems() {
  //   for (var i = 0; i < self.flowItemArray.length; i++) {
  //     self.flowItemArray[i]
  //   }
  // }

  function findMonthID() {
    for (var i = 0; i < allMonths.length; i++) {
      if(allMonths[i].month === self.currentMonth) {
        self.monthID = i + 1;
        console.log(self.monthID);
      }
    }
  }

  // set stage if new or returning user
  function setUpFlow(newUser) {
    if(newUser === true) {
      self.flowCategories = templateFactory.getItemTemplate("Flow");
      console.log(self.flowCategories);
    } else {
      self.flowCategories = self.getFlowItems;
      console.log(self.flowCategories);
      setToggles();
    }
  }



  // CRUD functions

  self.getFlowItems = function() {
    budgetFactory.getFlowItems()
    .then(function(result) {
      self.flowItemArray = result;
      console.log(result);
    });
  };

  self.postFlowItems = function(month) {
    console.log('post flow items clicked');
    budgetFactory.postFlowItems(month)
    .then(function(result) {
      console.log('Flow items inserted');
      return;
    },
    function(err) {
      console.log('Error inserting flow items for', currentUser.email, ': ', err);
      return;
    });
  };

  self.updateFlowItems = function() {
    console.log('update flow items clicked');
    budgetFactory.updateFlowItems(self.flowItemArray);
  };

}]); //end flow controller
