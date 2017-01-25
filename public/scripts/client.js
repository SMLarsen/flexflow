var app = angular.module('flexFlowApp', ['ngRoute', 'firebase']);

console.log('flexFlowApp running');

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: '/views/templates/home.html',
			controller: 'HomeController',
			controllerAs: 'hc'
		})
		.when('/welcome', {
			templateUrl: '/views/templates/welcome.html',
			controller: 'WelcomeController',
			controllerAs: 'wc'
		})
		.when('/clientprofile', {
			templateUrl: '/views/templates/clientprofile.html',
			controller: 'ClientProfileController',
			controllerAs: 'cp'
		})
		.when('/flexspend', {
			templateUrl: '/views/templates/flexspend.html',
			controller: 'FlexSpendController',
			controllerAs: 'fx'
		})
		.when('/flowspend', {
			templateUrl: '/views/templates/flowspend.html',
			controller: 'FlowSpendController',
			controllerAs: 'fl'
		})
		.when('/functionalspend', {
			templateUrl: '/views/templates/functionalspend.html',
			controller: 'FunctionalSpendController',
			controllerAs: 'fu'
		})
		.when('/financialspend', {
			templateUrl: '/views/templates/financialspend.html',
			controller: 'FinancialSpendController',
			controllerAs: 'fi'
		})
		.when('/additionalinfo', {
			templateUrl: '/views/templates/additionalinfo.html',
			controller: 'AdditionalInfoController',
			controllerAs: 'ai'
		})
		.when('/results', {
			templateUrl: '/views/templates/results.html',
			controller: 'ResultsController',
			controllerAs: 'rc'
		})
		.otherwise({
			redirectTo: 'home'
		});
}]); // End config
