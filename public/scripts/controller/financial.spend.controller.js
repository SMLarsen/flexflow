app.controller('FinancialSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function ($http, AuthFactory, TemplateFactory, BudgetFactory) {
	console.log('Financial Spend controller started');

	var self = this;
	self.newFinancialBudget = {};
	var templateFactory = TemplateFactory;
	self.itemArray = templateFactory.getItemTemplate("Financial");
	var budgetFactory = BudgetFactory;

	console.log("financial itemArray ", self.itemArray);

	// adding false value to itemArray
	removeActiveToggles();

	// toggles activeitem value for each item
	self.toggleActive = function (item) {
		if (item.activeitem === false) {
			item.activeitem = true;
		} else {
			item.activeitem = false;
		}
	}

	// removes all active values in individual functional items
	function removeActiveToggles() {
		for (var i = 0; i < self.itemArray.length; i++) {
			var item = self.itemArray[i];
			item.activeItem = false;
		}
	}

	self.postFinancialItems = function () {
		console.log('post financial items clicked');
		budgetFactory.postFinancialItems(self.itemArray)
			.then(function (result) {
					console.log('Financial items inserted ', self.itemArray);
					return;
				},
				function (err) {
					console.log('Error inserting financial items for', currentUser.email, ': ', err);
					return;
				});
	};

	self.getFinancialItems = function () {
		console.log("getFinancialItems is clicked");
		budgetFactory.getFinancialItems()
			.then(function (result) {
				console.log("getFinancialItems ", result)
				self.itemArray = result;
			});
	};

	self.updateFinancialItems = function () {
		console.log("update financial clicked ");
		budgetFactory.updateFinancialItems(self.itemArray)
			.then(function (result) {
				self.itemArray = result;
			});
	};
}]);