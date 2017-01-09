app.factory("BudgetFactory", function($http, AuthFactory) {
    console.log('BudgetFactory started');

    var authFactory = AuthFactory;
    // var currentUserEmail = 'stevelarsen01@gmail.com';
    // console.log(currentUserEmail);
    var profile = {};
    var itemArray = [];

    // function to get categories for initial load
    getBudget = function() {
      if (authFactory.currentUser) {
        console.log('Current',authFactory.getIdToken());
      } else {
        console.log('user not signed in');
      }
        // return authFactory.getIdToken()
        //     .then(function(currentUser) {
        //         return $http({
        //                 method: 'GET',
        //                 url: '/budget/profile/' + currentUser.Email,
        //                 headers: {
        //                     id_token: currentUser.authIdToken
        //                 }
        //             })
        //             .then(function(response) {
        //                     profile = response.data;
        //                     console.log('Profile1', response.data);
        //                     return profile;
        //                 },
        //                 function(err) {
        //                     console.log('Error getting profile for', currentUserEmail, ': ', err);
        //                     return;
        //                 });
        //     });
    }; //end getBudget

    var publicApi = {
        putBudget: function(budget) {
            return putBudget(budget);
        },
        getBudget: function() {
            return getBudget();
        },
        postBudget: function(budget) {
            return postBudget(budget);
        }

    };

    return publicApi;

}); // END: BudgetFactory
