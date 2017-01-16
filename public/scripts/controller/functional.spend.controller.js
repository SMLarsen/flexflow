app.controller('FunctionalSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function ($http, AuthFactory, TemplateFactory, BudgetFactory) {
	console.log('Functional Spend controller started');

	var self = this;

	var budgetFactory = BudgetFactory;

	self.newCategory = {};

	budgetFactory.getFunctionalItems().then(function (result) {
		self.itemArray = result;
		removeActiveToggles();
		console.log("functional self.itemArray ", self.itemArray);
	});

	// toggles activeItem value for each item
	self.toggleActive = function (item) {
		if (item.activeItem === false) {
			item.activeItem = true;
		} else {
			item.activeItem = false;
		}
	};

	// removes all active values in individual functional items
	function removeActiveToggles() {
		for (var i = 0; i < self.itemArray.length; i++) {
			var item = self.itemArray[i];
			item.activeItem = false;
		}
	}

	self.getFunctionalItems = function () {
		console.log("getFunctionalItems is clicked");
		budgetFactory.getFunctionalItems(self.itemArray);
	};

	self.updateFunctionalItems = function () {
		console.log("update functional clicked");
		budgetFactory.updateFunctionalItems(self.itemArray);
		// window.location = '/#/financialspend';
	};

	self.addFunctionalItem = function(){
		if(self.newCategory.item_name === null || self.newCategory.item_amount === null) {
			alert('Please enter an additional category before submitting.');
		} else {
			console.log(self.newCategory);
			self.itemArray.push(self.newCategory);
			self.updateFunctionalItems();
			self.itemArray = [];
		}
	};


}]);
