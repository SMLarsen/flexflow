app.controller('FinancialSpendController', ['$http', 'AuthFactory', 'TemplateFactory', function ($http, AuthFactory, TemplateFactory) {
	console.log('Financial Spend controller started');

	var self = this;
	var templateFactory = TemplateFactory;

	self.itemArray = templateFactory.getItemTemplate("Financial");
	console.log("financial itemArray ", self.itemArray);

}]);
