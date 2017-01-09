app.factory("TemplateFactory", function($http) {
    console.log('TemplateFactory started');

    var publicApi = {
        getIdToken: function() {
            return getIdToken();
        },
        logIn: function() {
            return logIn();
        },
        logOut: function() {
            return logOut();
        }
    };

    return publicApi;

}); // END: TemplateFactory
