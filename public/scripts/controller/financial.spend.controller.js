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
  }; // end setToggles

	// function to ensure zero values show up as placeholder in inputs
	function resetZeroValues() {
		for (var i = 0; i < self.itemArray.length; i++) {
			if(self.itemArray[i].item_amount == 0) {
				self.itemArray[i].item_amount = null;
			}
		}
	}; // end resetZeroValues

	self.getFinancialItems = function() {
		console.log("getFinancialItems is clicked");
		budgetFactory.getFinancialItems(self.itemArray);
	};

	self.updateFinancialItems = function() {
		console.log("updateFinancialItems is clicked");
		budgetFactory.updateFinancialItems(self.itemArray);
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

}]);
