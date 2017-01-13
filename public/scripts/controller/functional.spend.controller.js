app.controller('FunctionalSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function ($http, AuthFactory, TemplateFactory, BudgetFactory) {
	console.log('Functional Spend controller started');

	var self = this;
	self.newFunctionalBudget = {};
	var budgetFactory = BudgetFactory;


	budgetFactory.getFunctionalItems().then(function (result) {
		self.itemArray = result;
		removeActiveToggles();
		console.log("functional self.itemArray ", self.itemArray);
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

	self.getFunctionalItems = function () {
		console.log("getFunctionalItems is clicked");
		budgetFactory.getFunctionalItems(self.itemArray);
	};

	self.updateFunctionalItems = function () {
		console.log("update functional clicked");
		budgetFactory.updateFunctionalItems(self.itemArray);
	};

	

}]);

this.addInput = function() {
    var newInput = this.choices.length+1;
    $scope.choices.push({'id':'choice'+newItemNo});
  };