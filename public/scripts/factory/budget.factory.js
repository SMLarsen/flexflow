app.factory("BudgetFactory", function($http, AuthFactory) {
    console.log('BudgetFactory started');

    var authFactory = AuthFactory;
    var profile = {};
    var itemArray = [];

    // function to insert budget profile
    postBudget = function(profile) {
        console.log('postBudget');
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/budget/profile/' + currentUser.email,
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: profile
                })
                .then(function(response) {
                        // console.log('Profile updated');
                        return;
                    },
                    function(err) {
                        console.log('Error updating profile for', currentUser.email, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end postBudget

    // function to get budget profile
    getBudget = function() {
        var currentUser = authFactory.getCurrentUser();
        var currentEmail = currentUser.email;
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/profile/' + currentEmail,
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

    // function to update budget profile
    updateBudget = function(profile) {
        console.log('updateBudget');
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'PUT',
                    url: '/budget/profile/' + currentUser.email,
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: profile
                })
                .then(function(response) {
                        console.log('Profile updated');
                        return;
                    },
                    function(err) {
                        console.log('Error updating profile for', currentUser.email, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end updateBudget

    var publicApi = {
        // update budget profile
        updateBudget: function(profile) {
            return updateBudget(profile);
        },
        // get budget profile
        getBudget: function() {
            return getBudget();
        },
        // insert budget profile
        postBudget: function(profile) {
            return postBudget(profile);
        }
    };

    return publicApi;

}); // END: BudgetFactory
