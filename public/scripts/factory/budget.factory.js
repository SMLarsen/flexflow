app.factory("BudgetFactory", function($http, AuthFactory) {
    console.log('BudgetFactory started');

    var authFactory = AuthFactory;
    var profile = {};
    var itemArray = [];
    var flowItems = [];

//**************************** Budget Functions ******************************//
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

    //**************************** Flow Item Functions ******************************//
        // function to insert flow items
        postFlowItems = function(month) {
            console.log('postFlowItems');
            var currentUser = authFactory.getCurrentUser();
            if (currentUser) {
                return $http({
                        method: 'POST',
                        url: '/budget/flowitems/' + currentUser.email,
                        headers: {
                            id_token: authFactory.getIdToken()
                        },
                        data: month
                    })
                    .then(function(response) {
                            // console.log('Profile updated');
                            return;
                        },
                        function(err) {
                            console.log('Error updating flow items for', currentUser.email, ': ', err);
                            return;
                        });
            } else {
                console.log('User not signed in');
            }
        }; //end postFlowItems

        // function to get flow items
        getFlowItems = function() {
            var currentUser = authFactory.getCurrentUser();
            var currentEmail = currentUser.email;
            if (currentUser) {
                return $http({
                        method: 'GET',
                        url: '/budget/flowitems/' + currentEmail,
                        headers: {
                            id_token: authFactory.getIdToken()
                        }
                    })
                    .then(function(response) {
                            flowItems = response.data;
                            // console.log('Profile returned:', response.data);
                            return flowItems;
                        },
                        function(err) {
                            console.log('Error getting flow item for', currentEmail, ': ', err);
                            return;
                        });
            } else {
                console.log('User not signed in');
            }
        }; //end getFlowItems

        // function to update flow items
        updateFlowItems = function(month) {
            console.log('updateFlowItems');
            var currentUser = authFactory.getCurrentUser();
            if (currentUser) {
                return $http({
                        method: 'PUT',
                        url: '/budget/flowitems/' + currentUser.email,
                        headers: {
                            id_token: authFactory.getIdToken()
                        },
                        data: month
                    })
                    .then(function(response) {
                            console.log('Profile updated');
                            return;
                        },
                        function(err) {
                            console.log('Error updating flow item for', currentUser.email, ': ', err);
                            return;
                        });
            } else {
                console.log('User not signed in');
            }
        }; //end updateFlowItems

// ******************************** APIs ************************************//
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
        },
        // update flow item
        updateFlowItems: function(month) {
            return updateFlowItems(month);
        },
        // get flow item
        getFlowItems: function() {
            return getFlowItems();
        },
        // insert flow item
        postFlowItems: function(month) {
            return postFlowItems(month);
        },
        // update flex item
        updateFlexItems: function(month) {
            return updateFlexItems(month);
        },
        // get flex item
        getFlexItems: function() {
            return getFlexItems();
        },
        // insert flex item
        postFlexItems: function(month) {
            return postFlexItems(month);
        },
        // update financial item
        updateFinancialItems: function(month) {
            return updateFinancialItems(month);
        },
        // get financial item
        getFinancialItems: function() {
            return getFinancialItems();
        },
        // insert financial item
        postFinancialItems: function(month) {
            return postFinancialItems(month);
        },
        // update functional item
        updateFunctionalItems: function(month) {
            return updateFunctionalItems(month);
        },
        // get functional item
        getFunctionalItems: function() {
            return getFunctionalItems();
        },
        // insert functional item
        postFunctionalItems: function(month) {
            return postFunctionalItems(month);
        }
    };

    return publicApi;

}); // END: BudgetFactory
