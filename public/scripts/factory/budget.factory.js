app.factory("BudgetFactory", function($http, AuthFactory) {
    console.log('BudgetFactory started');

    var authFactory = AuthFactory;
    var profile = {};
    var itemArray = [];

    // function to get budget profile
    getBudget = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/profile/' + currentUser.email,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        profile = response.data;
                        console.log('Profile returned:', response.data);
                        return profile;
                    },
                    function(err) {
                        console.log('Error getting profile for', currentUserEmail, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
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
