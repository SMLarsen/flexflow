app.controller('ClientProfileController', ['$http', 'AuthFactory', 'TemplateFactory', function($http, AuthFactory, TemplateFactory) {
  console.log('Client Profile controller started');

  var self = this;

  var templateFactory = TemplateFactory;

  self.numPeople = 0;

  self.clickOnePerson = function() {
    self.numPeople = 1;
  }

  self.clickTwoPeople = function() {
    self.numPeople = 2;
  }

  self.clickThreePeople = function() {
    self.numPeople = 3;
  }

  self.clickFourPeople = function() {
    self.numPeople = 4;
  }



}]);
