app.controller('FunctionalSpendController', ['$http', 'AuthFactory', 'TemplateFactory', function ($http, AuthFactory, TemplateFactory) {
	console.log('Functional Spend controller started');

	var self = this;
	self.newFunctionalBudget = {};
	var templateFactory = TemplateFactory;
	self.itemArray = templateFactory.getItemTemplate("Functional");
	console.log("functional itemArray ", self.itemArray);

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
}]);
