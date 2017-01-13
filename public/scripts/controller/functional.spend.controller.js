app.controller('FunctionalSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function ($http, AuthFactory, TemplateFactory, BudgetFactory) {
	console.log('Functional Spend controller started');

	var self = this;
	self.newFunctionalBudget = {};
	var templateFactory = TemplateFactory;
	self.itemArray = templateFactory.getItemTemplate("Functional");
	var budgetFactory = BudgetFactory;

	console.log("itemArray ", self.itemArray);

	// adding false value to itemArray
	removeActiveToggles();

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
			item.activeItem = false;
		}
	}

	self.postFunctionalItems = function () {
		console.log('post functional items clicked');
		budgetFactory.postFunctionalItems(self.itemArray)
			.then(function (result) {
					console.log('Functional items inserted ', self.itemArray);
					return;
				},
				function (err) {
					console.log('Error inserting functional items for', currentUser.email, ': ', err);
					return;
				});
	};

	self.getFunctionalItems = function () {
		console.log("getFunctionalItems is clicked");
		budgetFactory.getFunctionalItems()
			.then(function (result) {
				console.log("getFunctionalItems ", result)
				self.itemArray = result;
			});
	};

	self.updateFunctionalItems = function () {
		console.log("update functional clicked");
		budgetFactory.updateFunctionalItems(self.itemArray)
			.then(function (result) {
				self.itemArray = result;
			});
	};
}]);