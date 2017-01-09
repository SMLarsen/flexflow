app.factory("BudgetFactory", function($http, AuthFactory) {
    console.log('BudgetFactory started');

var authFactory = AuthFactory;
var currentUserEmail = 'stevelarsen01@gmail.com';
console.log(currentUserEmail);
var profile = {};
var itemArray = [];

    // function to get categories for initial load
    getBudget = function() {
      return $http({
              method: 'GET',
              url: '/budget/profile/' + currentUserEmail
          })
          .then(function(response) {
                  profile = response.data;
                  console.log('Profile1', response.data);
                  return profile;
              },
              function(err) {
                  console.log('Error getting profile for', currentUserEmail, ': ', err);
                  return;
              });
    }; //end getBudget

  getBudget();

    var publicApi = {
        putBudget: function(budget) {
            return putBudget(budget);
        },
        getBudget: function(user) {
            return getBudget(user);
        },
        postBudget: function(budget) {
            return postBudget(budget);
        }

    };

    return publicApi;

}); // END: BudgetFactory
