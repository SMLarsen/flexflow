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
                    url: '/budget/profile',
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
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/profile',
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
                        console.log('Error getting profile', err);
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
                    url: '/budget/profile',
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
        // console.log('postFlowItems', month);
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/budget/flowitems',
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
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/flowitems',
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
                        console.log('Error getting flow item for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFlowItems


    // function to get flow items totals
    getFlowItemTotalsByMonth = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/flowitems/totalbymonth',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        flowItemMonthlyTotals = response.data;
                        console.log('flowItemMonthlyTotals', flowItemMonthlyTotals);
                        return flowItemMonthlyTotals;
                    },
                    function(err) {
                        console.log('Error getting flow item totals by month for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFlowItemTotalsByMonth

    // function to get flow items totals for year
    getFlowItemTotalByYear = function() {
        var currentUser = authFactory.getCurrentUser();

        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/flowitems/totalbyyear',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        flowItemYearlyTotal = response.data;
                        console.log('flowItemYearlyTotal', flowItemYearlyTotal);
                        return flowItemYearlyTotal;
                    },
                    function(err) {
                        console.log('Error getting flow item totals by year for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFlowItemTotalByYear

    // function to delete flow items
    deleteFlowItems = function(month) {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'DELETE',
                    url: '/budget/flowitems/' + month,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        console.log('Flow items deleted successfully');
                        return;
                    },
                    function(err) {
                        console.log('Error deleting flow items for month:', month, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end deleteFlowItems

    // function to update flow items (delete all for budgetID then add new items)
    updateFlowItems = function(budgetArray) {
        var month = budgetArray[0].item_month;
        deleteFlowItems(month)
            .then(function(response) {
                    postFlowItems(budgetArray)
                        .then(function(response) {
                                console.log('Flow items replaced');
                                return;
                            },
                            function(err) {
                                console.log('Error replacing flow items for', err);
                                return;
                            });
                },
                function(err) {
                    console.log('Replacement delete unsuccessful', err);
                    return;
                });
    };

    //**************************** Flex Item Functions ******************************//
    // function to insert flex items
    postFlexItems = function(budgetArray) {
        // console.log('postFlexItems', budgetArray);
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/budget/flexitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: budgetArray
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
    }; //end postFlexItems

    // function to get flow items
    getFlexItems = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/flexitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        flexItems = response.data;
                        // console.log('Profile returned:', response.data);
                        return flexItems;
                    },
                    function(err) {
                        console.log('Error getting flex item for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFlexItems

    // function to get flex items totals for year
    getFlexItemTotal = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/flexitems/total',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        flexItemTotal = response.data;
                        console.log('flexItemTotal', flexItemTotal);
                        return flexItemTotal;
                    },
                    function(err) {
                        console.log('Error getting flex item totals for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFlexItemTotal

    // function to delete flex items
    deleteFlexItems = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'DELETE',
                    url: '/budget/flexitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        console.log('Flex items deleted successfully');
                        return;
                    },
                    function(err) {
                        console.log('Error deleting flex items for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end deleteFlexItems

    // function to update flex items (delete all for budgetID then add new items)
    updateFlexItems = function(budgetArray) {
        deleteFlexItems()
            .then(function(response) {
                    postFlexItems(budgetArray)
                        .then(function(response) {
                                console.log('Flex items replaced');
                                return;
                            },
                            function(err) {
                                console.log('Error replacing flext items for', err);
                                return;
                            });
                },
                function(err) {
                    console.log('Replacement delete unsuccessful', err);
                    return;
                });
    };

    //**************************** Functional Item Functions ******************************//
    // function to insert functional items
    postFunctionalItems = function(budgetArray) {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/budget/functionalitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: budgetArray
                })
                .then(function(response) {
                        // console.log('Profile updated');
                        return;
                    },
                    function(err) {
                        console.log('Error updating functional items for', currentUser.email, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end postFunctionalItems

    // function to get functional items
    getFunctionalItems = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/functionalitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        functionalItems = response.data;
                        // console.log('Profile returned:', response.data);
                        return functionalItems;
                    },
                    function(err) {
                        console.log('Error getting functional item for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFunctionalItems

    // function to get functional items totals for year
    getFunctionalItemTotal = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/functionalitems/total',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        functionalItemTotal = response.data;
                        console.log('functionalItemTotal', functionalItemTotal);
                        return functionalItemTotal;
                    },
                    function(err) {
                        console.log('Error getting functional item totals for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFunctionalItemTotal

    // function to delete functional items
    deleteFunctionalItems = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'DELETE',
                    url: '/budget/functionalitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        console.log('Functional items deleted successfully');
                        return;
                    },
                    function(err) {
                        console.log('Error deleting functional items for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end deleteFunctionalItems

    // function to update functional items (delete all for budgetID then add new items)
    updateFunctionalItems = function(budgetArray) {
        deleteFunctionalItems()
            .then(function(response) {
                    postFunctionalItems(budgetArray)
                        .then(function(response) {
                                console.log('Functional items replaced');
                                return;
                            },
                            function(err) {
                                console.log('Error replacing functional items for', err);
                                return;
                            });
                },
                function(err) {
                    console.log('Replacement delete unsuccessful', err);
                    return;
                });
    };

    //**************************** Financial Item Functions ******************************//
    // function to insert financial items
    postFinancialItems = function(budgetArray) {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/budget/financialitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: budgetArray
                })
                .then(function(response) {
                        // console.log('Profile updated');
                        return;
                    },
                    function(err) {
                        console.log('Error updating financial items for', currentUser.email, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end postFinancialItems

    // function to get financial items
    getFinancialItems = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/financialitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        financialItems = response.data;
                        // console.log('Profile returned:', response.data);
                        return financialItems;
                    },
                    function(err) {
                        console.log('Error getting financial item for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFinancialItems

    // function to get financial items totals for year
    getFinancialItemTotal = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/financialitems/total',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        financialItemTotal = response.data;
                        console.log('financialItemTotal', financialItemTotal);
                        return financialItemTotal;
                    },
                    function(err) {
                        console.log('Error getting financial item totals for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getFinancialItemTotal

    // function to delete financial items
    deleteFinancialItems = function() {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'DELETE',
                    url: '/budget/financialitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        console.log('Financial items deleted successfully');
                        return;
                    },
                    function(err) {
                        console.log('Error deleting financial items for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end deleteFinancialItems

    // function to update financial items (delete all for budgetID then add new items)
    updateFinancialItems = function(budgetArray) {
        deleteFinancialItems()
            .then(function(response) {
                    postFinancialItems(budgetArray)
                        .then(function(response) {
                                console.log('Financial items replaced');
                                return;
                            },
                            function(err) {
                                console.log('Error replacing financial items for', err);
                                return;
                            });
                },
                function(err) {
                    console.log('Replacement delete unsuccessful', err);
                    return;
                });
    };

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
        updateFlexItems: function(budgetArray) {
            return updateFlexItems(budgetArray);
        },
        // get flex item
        getFlexItems: function() {
            return getFlexItems();
        },
        // insert flex item
        postFlexItems: function(budgetArray) {
            return postFlexItems(budgetArray);
        },
        // update financial item
        updateFinancialItems: function(budgetArray) {
            return updateFinancialItems(budgetArray);
        },
        // get financial item
        getFinancialItems: function() {
            return getFinancialItems();
        },
        // insert financial item
        postFinancialItems: function(budgetArray) {
            return postFinancialItems(budgetArray);
        },
        // update functional item
        updateFunctionalItems: function(budgetArray) {
            return updateFunctionalItems(budgetArray);
        },
        // get functional item
        getFunctionalItems: function() {
            return getFunctionalItems();
        },
        // insert functional item
        postFunctionalItems: function(budgetArray) {
            return postFunctionalItems(budgetArray);
        },
        getFlowItemTotalsByMonth: function() {
            return getFlowItemTotalsByMonth();
        },
        getFlowItemTotalByYear: function() {
            return getFlowItemTotalByYear();
        },
        getFlexItemTotal: function() {
            return getFlexItemTotal();
        },
        getFinancialItemTotal: function() {
            return getFinancialItemTotal();
        },
        getFunctionalItemTotal: function() {
            return getFunctionalItemTotal();
        }
    };

    return publicApi;

}); // END: BudgetFactory
