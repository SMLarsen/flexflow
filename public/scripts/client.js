var app = angular.module('flexFlowApp', ['ngRoute', 'firebase']);

console.log('flexFlowApp running');

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: '/views/templates/home.html',
            controller: 'HomeController',
            controllerAs: 'hc'
        })
        .otherwise({
            redirectTo: 'home'
        });
}]); // End config
