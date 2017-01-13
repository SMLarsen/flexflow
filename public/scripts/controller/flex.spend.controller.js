app.controller('FlexSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function($http, AuthFactory, TemplateFactory, BudgetFactory) {
  console.log('Flex Spend controller started');

  var self = this;

  var templateFactory = TemplateFactory;
  var budgetFactory = BudgetFactory;

  budgetFactory.getFlexItems().then(function(result){
    self.flexArray = result;
  });

  self.submitFlex = function(){
    console.log(self.flexArray);
    budgetFactory.updateFlexItems(self.flexArray);
    window.location = '/#/flowspend';
  };

}]);
