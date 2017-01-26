/*jshint esversion: 6 */
app.factory("BudgetFactory", function($http, AuthFactory, TemplateFactory) {
    // console.log('BudgetFactory started');

    const FLEX = 2;
    const FUNCTIONAL = 3;
    const FINANCIAL = 4;

    let authFactory = AuthFactory;
    let templateFactory = TemplateFactory;

    let newFunctionalItemArray = [];
    let newFinancialItemArray = [];
    let newFlowItemArray = [];

    let profile = {};
    let flowItems = [];

    //**************************** Budget Functions ******************************//

    // Function to build empty budget
    buildEmptyBudget = function(itemMonth, itemYear) {
        // Build flow items (id = 1)
        itemMonth = parseInt(itemMonth);
        itemYear = parseInt(itemYear);
        for (let m = 1; m === templateFactory.templateData.flowTemplateItems.length; m++) {
            templateFactory.templateData.flowTemplateItems[m].item_sort_sequence = m;
        }
        for (let l = 0; l < 12; l++) {
            for (let k = 0; k < templateFactory.templateData.flowTemplateItems.length; k++) {
                let newFlowItem = {};
                newFlowItem.item_amount = 0;
                newFlowItem.budget_template_category_id = 1;
                newFlowItem.item_month = itemMonth;
                newFlowItem.item_year = itemYear;
                newFlowItem.item_img_src = templateFactory.templateData.flowTemplateItems[k].item_img_src;
                newFlowItem.item_name = templateFactory.templateData.flowTemplateItems[k].item_name;
                newFlowItem.item_sort_sequence = templateFactory.templateData.flowTemplateItems[k].item_sort_sequence;
                newFlowItemArray.push(newFlowItem);
            }
            itemMonth++;
            if (itemMonth > 12) {
                itemMonth = 1;
                itemYear++;
            }
        }
        postFlowItems(newFlowItemArray);

        // Build financial items (id = 4)
        for (let i = 0; i < templateFactory.templateData.financialTemplateItems.length; i++) {
            let newFinancialItem = {};
            newFinancialItem.item_amount = 0;
            newFinancialItem.budget_template_category_id = FINANCIAL;
            newFinancialItem.item_img_src = templateFactory.templateData.financialTemplateItems[i].item_img_src;
            newFinancialItem.item_name = templateFactory.templateData.financialTemplateItems[i].item_name;
            newFinancialItem.item_sort_sequence = templateFactory.templateData.financialTemplateItems[i].item_sort_sequence;
            newFinancialItemArray.push(newFinancialItem);
        }
        postBudgetItems(newFinancialItemArray, FINANCIAL);

        // Build functional items (id = 3)
        for (let j = 0; j < templateFactory.templateData.functionalTemplateItems.length; j++) {
            let newFunctionalItem = {};
            newFunctionalItem.item_amount = 0;
            newFunctionalItem.budget_template_category_id = FUNCTIONAL;
            newFunctionalItem.item_name = templateFactory.templateData.functionalTemplateItems[j].item_name;
            newFunctionalItem.item_img_src = templateFactory.templateData.functionalTemplateItems[j].item_img_src;
            newFunctionalItem.item_sort_sequence = templateFactory.templateData.functionalTemplateItems[j].item_sort_sequence;
            newFunctionalItemArray.push(newFunctionalItem);
        }
        postBudgetItems(newFunctionalItemArray, FUNCTIONAL);
    };

    // function to insert budget profile
    postBudget = function(profile) {
        let itemMonth = profile.budget_start_month;
        let itemYear = profile.budget_start_year;
        if (profile.meeting_scheduled === null) {
          profile.meeting_scheduled = FALSE;
        }
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/profile',
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: profile
                })
                .then(function(response) {
                        buildEmptyBudget(itemMonth, itemYear);
                        console.log();
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
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/profile',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        profile = response.data;
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
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'PUT',
                    url: '/profile',
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: profile
                })
                .then(function(response) {
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

    updateBudgetStatus = function(status) {
      profile.budget_status = status;
      return updateBudget(profile);
    };

    //**************************** Flow Item Functions ******************************//
    // function to insert flow items
    postFlowItems = function(month) {
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/item/flowitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: month
                })
                .then(function(response) {
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
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/item/flowitems',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        flowItems = response.data;
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
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/total/flowitems/totalbymonth',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        flowItemMonthlyTotals = response.data;
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
        let currentUser = authFactory.getCurrentUser();

        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/total/flowitems/totalbyyear',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        flowItemYearlyTotal = response.data;
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
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'DELETE',
                    url: '/item/flowitems/' + month,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
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
        let month = budgetArray[0].item_month;
        return deleteFlowItems(month)
            .then(function(response) {
                    return postFlowItems(budgetArray)
                        .then(function(response) {
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
        for (let i = 0; i < budgetArray.length; i++) {
            budgetArray[i].budget_template_category_id = categoryID;
        }
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/item/items',
                    headers: {
                        id_token: authFactory.getIdToken()
                    },
                    data: budgetArray
                })
                .then(function(response) {
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
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/item/items/' + categoryID,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        budgetItems = response.data;
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
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/total/items/' + categoryID,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        budgetItemTotal = response.data;
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
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'DELETE',
                    url: '/item/items/' + categoryID,
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
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
    // function to insert comments items
    postAdditionalInfo = function(budgetArray) {
        //console.log("budgetArray: ", budgetArray);
        let currentUser = authFactory.getCurrentUser();
        //console.log("email user ", currentUser);
        if (currentUser) {
            return $http({
                    method: 'POST',
                    url: '/item/comments',
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
                        console.log('Error adding comment for', currentUser.email, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end comments items

    // function to insert comments items
    getAdditionalInfo = function() {
        let currentUser = authFactory.getCurrentUser();
        if (currentUser) {
            return $http({
                    method: 'GET',
                    url: '/item/comments',
                    headers: {
                        id_token: authFactory.getIdToken()
                    }
                })
                .then(function(response) {
                        return response;
                    },
                    function(err) {
                        console.log('Error adding comment for', currentUser.email, ': ', err);
                        return;
                    });
        } else {
            console.log('User not signed in');
        }
    }; //end comments items



    // ******************************** APIs ************************************//
    let publicApi = {
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
        },
        getAdditionalInfo: function() {
            return getAdditionalInfo();
        },
        updateBudgetStatus: function(status) {
            return updateBudgetStatus(status);
        }

    };

    return publicApi;

}); // END: BudgetFactory
