app.factory("TemplateFactory", function($http) {
    // console.log('TemplateFactory started');

    var templateData = {
        categoryTemplate: [],
        flowTemplateItems: [],
        functionalTemplateItems: [],
        financialTemplateItems: [],
    };
    var itemArray = [];

    // function to do initial load of template date
    loadTemplateData = function() {
        templateData.flowTemplateItems = [];
        templateData.functionalTemplateItems = [];
        templateData.financialTemplateItems = [];
        getCategories();
        getItems();
    }; // end loadTemplateData

    // function to get categories for initial load
    getCategories = function() {
        return $http({
                method: 'GET',
                url: '/template/category'
            })
            .then(function(response) {
                    templateData.categoryTemplate = response.data;
                    // console.log('Categories', response.data);
                    return;
                },
                function(err) {
                    console.log('error getting /template/category ', err);
                    return;
                });
    }; //end getCategories

    // function to get items for initial load
    getItems = function() {
        return $http({
                method: 'GET',
                url: '/template/item'
            })
            .then(function(response) {
                    itemArray = response.data;
                    // console.log('Items returned:', response.data);
                    buildCategoryArrays(itemArray);
                    // console.log('template data:', templateData);
                    return;
                },
                function(err) {
                    console.log('Error getting /template/item', err);
                    return;
                });
    }; //end getItems

    buildCategoryArrays = function(itemArray) {
        for (var i = 0; i < itemArray.length; i++) {
            switch (itemArray[i].category_name) {
                case 'Flow':
                    templateData.flowTemplateItems.push(itemArray[i]);
                    break;
                case 'Functional':
                    templateData.functionalTemplateItems.push(itemArray[i]);
                    break;
                case 'Financial':
                    templateData.financialTemplateItems.push(itemArray[i]);
                    break;
                default:
            }
        }
    };

    // function to get info needed to build budget template
    // returns object for requested category
    getCategoryTemplate = function(category) {
        for (var i = 0; i < categoryTemplate.length; i++) {
            if (categoryTemplate[i].category_name === category) {
                return categoryTemplate[i];
            }
        }
    }; // end getCategoryTemplate

    // function to return template items for requested category
    // returns array of item objects
    getItemTemplate = function(category) {
        var categoryID = 0;
        for (var i = 0; i < categoryTemplate.length; i++) {
            if (categoryTemplate[i].category_name === category) {
                categoryID = categoryTemplate[i].id;
            }
        }
        var categoryItems = [];
        for (var j = 0; j < itemTemplate.length; j++) {
            if (itemTemplate[j].budget_category_id === categoryID) {
                categoryItems.push(itemTemplate[j]);
            }
        }
        return categoryItems;
    }; // end getItemTemplate

    var publicApi = {
        templateData: templateData,
        getCategoryTemplate: function(category) {
            return getCategoryTemplate(category);
        },
        getItemTemplate: function(category) {
            return getItemTemplate(category);
        },
        loadTemplateData: function() {
            return loadTemplateData();
        }
    };

    return publicApi;

}); // END: TemplateFactory
