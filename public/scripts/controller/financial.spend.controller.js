app.controller('FinancialSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function ($http, AuthFactory, TemplateFactory, BudgetFactory) {
	console.log('Financial Spend controller started');

	var self = this;
	self.newFinancialBudget = {};
	var budgetFactory = BudgetFactory;

	budgetFactory.getFinancialItems().then(function (result) {
		self.itemArray = result;
		removeActiveToggles();
		console.log("financial self.itemArray ", self.itemArray);
	});

	// toggles activeitem value for each item
	self.toggleActive = function (item) {
		if (item.activeitem === false) {
			item.activeitem = true;
		} else {
			item.activeitem = false;
		}
	};

	// removes all active values in individual functional items
	function removeActiveToggles() {
		for (var i = 0; i < self.itemArray.length; i++) {
			var item = self.itemArray[i];
			item.activeitem = false;
		}
	}

	self.getFinancialItems = function () {
		console.log("getFinancialItems is clicked");
		budgetFactory.getFinancialItems(self.itemArray);
	};

	self.updateFinancialItems = function () {
		console.log("update financial clicked ");
		budgetFactory.updateFinancialItems(self.itemArray);
	};
}]);