(function() {
var app = angular.module('LeagueTracker', []);

app.factory('Users', ['$resource', function($resource) {
return $resource('/users/login', null,
    {
        'login': { method:'POST' }
    });
}]);

app.controller('LoginController', function($http) {
    this.user = {}
    this.login = function() {
        $http.post('/users/login', this.user)
            .success(function(data, status, headers, config) {
                console.log("Success",data,status,headers,config);
            }).error(function(data, status, headers, config) {
                console.log("Failure",data,status,headers,config);
            });
        };
});

app.controller('UserCreateController', function($http) {
    this.newUser = {};
    this.createUser = function() {
        if(this.newUser.password === this.newUser.passwordConfirmation) {
            $http.post('/users', this.newUser)
                .success(function(data, status, headers, config) {
                    console.log("Success",data,status,headers,config);
                }).error(function(data, status, headers, config) {
                    console.log("Failure",data,status,headers,config);
                });
        }
    };
});
})();