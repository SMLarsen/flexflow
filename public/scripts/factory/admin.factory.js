app.factory("AdminFactory", function($http) {
    // console.log('AdminFactory started');

    var adminData = {
        adminArray: []
    };

    // function to get admin data for initial load
    getAdminData = function() {
        return $http({
                method: 'GET',
                url: '/admin'
            })
            .then(function(response) {
                    adminData.adminArray = response.data;
                    return;
                },
                function(err) {
                    console.log('error getting admin data ', err);
                    return;
                });
    }; //end getAdminData


    // function to get parameter value
    getAdminParameter = function(parameter) {
      for (var i = 0; i < adminData.adminArray.length; i++) {
        if (adminData.adminArray[i].parameter_name === parameter) {
          return adminData.adminArray[i].parameter_value;
        }
      }
    }; //end getAdminParameter


    var publicApi = {
        adminData: adminData,
        getAdminData: function() {
            return getAdminData();
        },
        getAdminParameter: function(parameter) {
            return getAdminParameter(parameter);
        }
    };

    return publicApi;

}); // END: TemplateFactory
