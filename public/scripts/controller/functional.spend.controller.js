app.controller('FunctionalSpendController', ['$http', 'AuthFactory', 'TemplateFactory', function($http, AuthFactory, TemplateFactory) {
  console.log('Functional Spend controller started');

// Add functional spending to DB
  self.addFunctionalSpenging = function () {
  		console.log('new article: ', self.newArticle);
  		$http.post('/insertArticle', self.newArticle)
  			.then(function (response) {
  				console.log('POST finished. Get articles again.');
  				getArticles();
  			});
  	};


}]);
