app.controller('FinancialSpendController', ['BudgetFactory', function (BudgetFactory) {
	console.log('Financial Spend controller started');

	var self = this;

	var budgetFactory = BudgetFactory;

	self.navActive = false;

	self.activateMobileNav = function() {
		if(self.navActive === false){
			self.navActive = true;
		} else {
			self.navActive = false;
		}
	};

	budgetFactory.getBudget().then(function(results){
		self.budget = results;
		self.budgetStatus = self.budget.budget_status;
    switch (self.budgetStatus) {
      case "Finished":
      self.budgetStatusIndex = 6;
      break;
      case "Comments":
      self.budgetStatusIndex = 6;
      break;
      case "Financial":
      self.budgetStatusIndex = 5;
      break;
      case "Functional":
      self.budgetStatusIndex = 4;
      break;
      case "Flow":
      self.budgetStatusIndex = 3;
      break;
      case "Flex":
      self.budgetStatusIndex = 2;
      break;
      case "Profile":
      self.budgetStatusIndex = 1;
      break;
      default:
      self.budgetStatusIndex = 0;
    }
	});

	budgetFactory.getFinancialItems().then(function(result) {
		self.itemArray = result;
		setToggles();
		resetZeroValues();
		console.log("financial self.itemArray ", self.itemArray);
	});

	// toggles activeitem value for each item
	self.toggleActive = function(item) {
		if (item.activeItem === false) {
			item.activeItem = true;
		} else {
			item.activeItem = false;
		}
	};

	// removes all active values in individual flow categories
  function setToggles() {
    for (var i = 0; i < self.itemArray.length; i++) {
      var category = self.itemArray[i];
      if(category.item_amount === undefined || category.item_amount === 0 || category.item_amount === null) {
        category.activeItem  = false;
      } else {
        category.activeItem = true;
      }
    }
  } // end setToggles

	// function to ensure zero values show up as placeholder in inputs
	function resetZeroValues() {
		for (var i = 0; i < self.itemArray.length; i++) {
			if(self.itemArray[i].item_amount === 0) {
				self.itemArray[i].item_amount = null;
			}
		}
	} // end resetZeroValues

	self.getFinancialItems = function() {
		console.log("getFinancialItems is clicked");
		budgetFactory.getFinancialItems(self.itemArray);
	};

	self.updateFinancialItems = function() {
		console.log("updateFinancialItems is clicked");
		setInactiveValuesToZero();
		budgetFactory.updateFinancialItems(self.itemArray).then(function(result){
			switch (self.budget.budget_status) {
        case "Finished":
        budgetFactory.updateBudgetStatus("Finished");
        break;
        case "Comments":
        budgetFactory.updateBudgetStatus("Comments");
        break;
        case "Financial":
        budgetFactory.updateBudgetStatus("Financial");
        break;
        default:
        budgetFactory.updateBudgetStatus("Financial");
      }
		});
		window.location = '/#/additionalinfo';
	};

	self.addFinancialItem = function() {
		if(self.newCategory.item_name === null || self.newCategory.item_amount === null) {
			alert('Please enter an additional category before submitting.');
		} else {
			console.log(self.newCategory);
			self.newCategory.activeItem = true;
			self.newCategory.item_img_src = 'additional.svg';
			self.newCategory.item_sort_sequence = self.itemArray.length + 2;
			self.newCategory.budget_template_category_id = 4;
			self.itemArray.push(self.newCategory);
			self.newCategory = {};
		}
	};

	function setInactiveValuesToZero() {
    for ( i = 0; i < self.itemArray.length; i++) {
      if(self.itemArray[i].activeItem === false) {
        self.itemArray[i].item_amount = 0;
      }
    }
  }

}]);
