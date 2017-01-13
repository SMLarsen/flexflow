app.factory("BudgetFactory", function($http, AuthFactory, TemplateFactory) {
    console.log('BudgetFactory started');

    var FLEX = 2;
    var FUNCTIONAL = 3;
    var FINANCIAL = 4;

    var authFactory = AuthFactory;
    var templateFactory = TemplateFactory;
    var flowItemArray = templateFactory.templateData.flowTemplateItems;
    var newFunctionalItemArray = [];
    var newFinancialItemArray = [];
    var newFlowItemArray = [];
    var newFlowItem = {};
    var financialItemArray = templateFactory.templateData.financialTemplateItems;
    var functionalItemArray = templateFactory.templateData.functionalTemplateItems;
    var profile = {};
    var flowItems = [];

    //**************************** Budget Functions ******************************//

    // Function to build empty budget
    buildEmptyBudget = function(itemMonth, itemYear) {
        // Build flow items (id = 1)
        itemMonth = parseInt(itemMonth);
        itemYear = parseInt(itemYear);
        for (var m = 1; m === flowItemArray.length; m++) {
            flowItemArray[m].item_sort_sequence = m;
        }
        for (var l = 0; l < 12; l++) {
            for (var k = 0; k < flowItemArray.length; k++) {
                newFlowItem = {};
                newFlowItem.item_amount = 0;
                newFlowItem.budget_template_category_id = 1;
                newFlowItem.item_month = itemMonth;
                newFlowItem.item_year = itemYear;
                newFlowItem.item_name = flowItemArray[k].item_name;
                newFlowItem.item_sort_sequence = flowItemArray[k].item_sort_sequence;
                newFlowItemArray.push(newFlowItem);
            }
            itemMonth++;
            if (itemMonth > 12) {
                itemMonth = 1;
                itemYear++;
            }
        }
        postFlowItems(newFlowItemArray);
        // console.log('empty flow budget:', newFlowItemArray);

        // Build financial items (id = 4)
        for (var i = 0; i < financialItemArray.length; i++) {
            newFinancialItem = {};
            newFinancialItem.item_amount = 0;
            newFinancialItem.budget_template_category_id = FINANCIAL;
            newFinancialItem.item_name = financialItemArray[i].item_name;
            newFinancialItem.item_sort_sequence = financialItemArray[i].item_sort_sequence;
            newFinancialItemArray.push(newFinancialItem);
        }
        // console.log('empty financial budget:', newFinancialItemArray);
        postBudgetItems(newFinancialItemArray, FINANCIAL);

        // Build functional items (id = 3)
        for (var j = 0; j < functionalItemArray.length; j++) {
            newFunctionalItem = {};
            newFunctionalItem.item_amount = 0;
            newFunctionalItem.budget_template_category_id = FUNCTIONAL;
            newFunctionalItem.item_name = functionalItemArray[j].item_name;
            newFunctionalItem.item_sort_sequence = functionalItemArray[j].item_sort_sequence;
            newFunctionalItemArray.push(newFunctionalItem);
        }
        // console.log('empty functional budget:', newFunctionalItemArray);
        postBudgetItems(newFunctionalItemArray, FUNCTIONAL);
    };

    // function to insert budget profile
    postBudget = function(profile) {
        console.log('postBudget');
        var itemMonth = profile.budget_start_month;
        var itemYear = profile.budget_start_year;
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
                        buildEmptyBudget(itemMonth, itemYear);
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
        return deleteFlowItems(month)
            .then(function(response) {
                    postFlowItems(budgetArray)
                        .then(function(response) {
                                console.log('Flow items replaced');
                                return ;
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

    //**************************** Budget Item Functions ******************************//
    // function to insert budget items
    postBudgetItems = function(budgetArray, categoryID) {
        for (var i = 0; i < budgetArray.length; i++) {
            budgetArray[i].budget_template_category_id = categoryID;
        }
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/budget/items',
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
                        console.log('Error updating budget items for', currentUser.email, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end postBudgetItems

    // function to get flow items
    getBudgetItems = function(categoryID) {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/items/' + categoryID,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        budgetItems = response.data;
                        // console.log('Profile returned:', response.data);
                        return budgetItems;
                    },
                    function(err) {
                        console.log('Error getting budget item for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getBudgetItems

    // function to get budget items totals for year
    getBudgetItemTotal = function(categoryID) {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/budget/items/total/' + categoryID,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        budgetItemTotal = response.data;
                        console.log('budgetItemTotal', budgetItemTotal);
                        return budgetItemTotal;
                    },
                    function(err) {
                        console.log('Error getting budget item totals for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end getBudgetItemTotal

    // function to delete budget items
    deleteBudgetItems = function(categoryID) {
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'DELETE',
                    url: '/budget/items/' + categoryID,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        console.log('Budget items deleted successfully');
                        return;
                    },
                    function(err) {
                        console.log('Error deleting budget items for', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end deleteBudgetItems

    // function to update budget items (delete all for budgetID then add new items)
    updateBudgetItems = function(budgetArray, categoryID) {
        return deleteBudgetItems(categoryID)
            .then(function(response) {
                    postBudgetItems(budgetArray, categoryID)
                        .then(function(response) {
                                console.log('Budget items replaced');
                                return;
                            },
                            function(err) {
                                console.log('Error replacing budget items for', err);
                                return;
                            });
                },
                function(err) {
                    console.log('Replacement delete unsuccessful', err);
                    return;
                });
    };
    //**************************** AddiontalInfo Item Functions ******************************//
    // function to insert financial items
    postAdditionalInfo = function(budgetArray) {
        //console.log("budgetArray: ", budgetArray);
        var currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/budget/comments',
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
                        console.log('Error adding budget items for', currentUser.email, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end postFinancialItems



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
            return updateBudgetItems(budgetArray, FLEX);
        },
        // get flex item
        getFlexItems: function() {
            return getBudgetItems(FLEX);
        },
        // insert flex item
        postFlexItems: function(budgetArray) {
            return postBudgetItems(budgetArray, FLEX);
        },
        // update financial item
        updateFinancialItems: function(budgetArray) {
            return updateBudgetItems(budgetArray, FINANCIAL);
        },
        // get financial item
        getFinancialItems: function() {
            return getBudgetItems(FINANCIAL);
        },
        // insert financial item
        postFinancialItems: function(budgetArray) {
            return postBudgetItems(budgetArray, FINANCIAL);
        },
        // update functional item
        updateFunctionalItems: function(budgetArray) {
            return updateBudgetItems(budgetArray, FUNCTIONAL);
        },
        // get functional item
        getFunctionalItems: function() {
            return getBudgetItems(FUNCTIONAL);
        },
        // insert functional item
        postFunctionalItems: function(budgetArray) {
            return postBudgetItems(budgetArray, FUNCTIONAL);
        },
        getFlowItemTotalsByMonth: function() {
            return getFlowItemTotalsByMonth();
        },
        getFlowItemTotalByYear: function() {
            return getFlowItemTotalByYear();
        },
        getFlexItemTotal: function() {
            return getBudgetItemTotal(FLEX);
        },
        getFinancialItemTotal: function() {
            return getBudgetItemTotal(FINANCIAL);
        },
        getFunctionalItemTotal: function() {
            return getBudgetItemTotal(FUNCTIONAL);
        },
        postAdditionalInfo: function(budgetArray) {
            return postAdditionalInfo(budgetArray);
        }

    };

    return publicApi;

}); // END: BudgetFactory
