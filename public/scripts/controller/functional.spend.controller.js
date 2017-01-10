app.controller('FunctionalSpendController', ['$http', 'AuthFactory', 'TemplateFactory', function ($http, AuthFactory, TemplateFactory) {
	console.log('Functional Spend controller started');

	var self = this;
	var templateFactory = TemplateFactory;

	self.itemArray = templateFactory.getItemTemplate("Functional");
	console.log("functional itemArray ", self.itemArray);
}]);
