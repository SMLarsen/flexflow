app.controller('FunctionalSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function ($http, AuthFactory, TemplateFactory, BudgetFactory) {
	console.log('Functional Spend controller started');

	var self = this;
	var budgetFactory = BudgetFactory;
	self.newItem = {
		item_name: null,
		item_amount: null
	};

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

self.addInput = function () {
	var newInput = self.itemArray.length + 1;
	this.itemArray.push({
		item_name: null,
		item_amount: null

	});
};

function setToggles(){
    for (var i = 0; i < self.itemArray.length; i++) {
      var item = self.itemArray[i];
      if(item.item_amount === undefined || item.item_amount === 0 || category.item_amount === null) {
        item.activeitem  = false;
      } else {
        item.activeitem = true;
      }
    }
  }

}]);

