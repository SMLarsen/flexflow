app.controller('FlowSpendController', ['BudgetFactory', function(BudgetFactory) {
  console.log('Flow Spend controller started');
  var self = this;
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
  self.budgetMonths = [];
  self.startingMonthID = 0;
  self.startingMonth = '';
  self.startingYear = null;
  self.currentMonth = null;
  self.currentMonthIndex = null;
  self.monthlyBudgetData = [];
  self.newFlowBudget = [];
  self.newCategories = [];
  self.flowTotals = [];
  self.newCategory = {
    item_name: null,
    item_amount: null
  };
  var budgetFactory = BudgetFactory;

  // $('#monthDataForm').on('hidden', function () {
  //   console.log('closed');
  //   findMonthTotals();
  // });

  self.getFlowItems = function() {
    budgetFactory.getFlowItems()
    .then(function(result) {
      console.log(result);
      self.monthlyBudgetData = [];
      self.monthlyBudgetData = result;
      findMonthTotals();
    });
  };

  self.updateFlowItems = function() {
    console.log('update flow items clicked');
    budgetFactory.updateFlowItems(self.flowCategories);
  };

  self.postFlowItems = function() {
    console.log('post flow items clicked');
    budgetFactory.postFlowItems(self.newCategories)
    .then(function(result) {
      console.log('Flow items inserted');
      self.getFlowItems();
      return;
    },
    function(err) {
      console.log('Error inserting flow items for', currentUser.email, ': ', err);
      return;
    });
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
    pullCurrentMonthData();
    setToggles();
    console.log(self.flowCategories);
  }; // end enterMonthFlowData

  // advances to the next month
  self.nextMonth = function() {
    setInactiveValuesToZero();
    structureMonthFlowData();
    self.updateFlowItems();
    setNextMonthData();
    pullCurrentMonthData();
    setToggles();
    console.log(self.flowCategories);
  }; // end nextMonth

  // retreats to previous month
  self.prevMonth = function() {
    setInactiveValuesToZero();
    structureMonthFlowData();
    self.updateFlowItems();
    setPrevMonthData();
    pullCurrentMonthData();
    setToggles();
  }; // end prevMonth

  // reverts to previous flex spending page
  self.prevPage = function() {
    window.location = '/#/flexspend'
  }; // end prevPage

  // advances to functional spending page
  self.nextPage = function() {
    window.location = '/#/functionalspend'
  }; // end nextPage

  // toggles activeCategory value for each category
  self.toggleActive = function(category) {
    if(category.activeCategory === false) {
      category.activeCategory = true;
    } else {
      category.activeCategory = false;
    }
  }; // end toggleActive

  self.addCategory = function() {
    self.flowCategories.push({
      month: self.currentMonthData.month,
      year: self.currentMonthData.month,
      month_id: self.currentMonthData.month_id,
      item_img_src: 'additional.svg',
      item_sort_sequence: self.flowCategories.length + 1,
      item_amount: null,
      item_name: null
    });
  }

  // removes all active values in individual flow categories
  function setToggles(){
    for (var i = 0; i < self.flowCategories.length; i++) {
      var category = self.flowCategories[i];
      if(category.item_amount === undefined || category.item_amount === 0 || category.item_amount === null) {
        category.activeCategory  = false;
      } else {
        category.activeCategory = true;
      }
    }
  } // end setToggles

  // restructuring monthly flow data for database
  function structureMonthFlowData() {
    for (var i = 0; i < self.flowCategories.length; i++) {
      if(self.flowCategories[i].item_amount === undefined || self.flowCategories[i].item_amount === null) {
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
  } // end structureMonthFlowData

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

  // function to pull data from returned database array and push it onto array tied to DOM
  function pullCurrentMonthData() {
    self.flowCategories = [];
    for (var i = 0; i < self.monthlyBudgetData.length; i++) {
      if(self.monthlyBudgetData[i].item_month == self.currentMonthData.month_id) {
        self.flowCategories.push(self.monthlyBudgetData[i]);
      }
    }
    resetZeroValues();
  } // end pullCurrentMonthData

  // function to ensure zero values show up as placeholder in inputs
  function resetZeroValues() {
    for (var i = 0; i < self.flowCategories.length; i++) {
      if(self.flowCategories[i].item_amount == 0) {
        self.flowCategories[i].item_amount = null;
      }
    }
  } // end resetZeroValues

  self.addBudgetItem = function(){
    if(self.newCategory.item_name === null || self.newCategory.item_amount === null) {
      alert('Please enter an additional category before submitting.');
    } else {
      self.newCategory.item_month = self.currentMonthData.month_id;
      self.newCategory.item_year = self.currentMonthData.year;
      self.newCategory.item_sort_sequence = self.flowCategories.length + 1;
      self.newCategory.item_img_src = 'additional.svg';
      console.log(self.newCategory);
      self.newCategories.push(self.newCategory);
      self.postFlowItems();
      self.newCategories = [];
    }
  }

  function findMonthTotals() {
    for (var i = 0; i < self.monthlyBudgetData.length; i++) {
      for (var x = 0; x < self.budgetMonths.length; x++) {
        if(self.monthlyBudgetData[i].item_month === self.budgetMonths[x].month_id) {
          self.budgetMonths[x].month_total += self.monthlyBudgetData[i].item_amount;
        }
      }
    }

    for (var i = 0; i < self.budgetMonths.length; i++) {
      if(self.budgetMonths[i].month_total === 0) {
        self.budgetMonths[i].month_total = null;
      }
    }
  } // end findMonthTotals

  function setInactiveValuesToZero() {
    for (var i = 0; i < self.flowCategories.length; i++) {
      if(self.flowCategories[i].activeCategory === false) {
        self.flowCategories[i].item_amount = 0;
      }
    }
  }

}]); //end flow controller
