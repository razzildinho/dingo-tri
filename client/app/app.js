'use strict';

(function(){

    angular.module('triApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'btford.socket-io',
        'ui.router',
        'angular-jwt'
    ]);

    var MainConfig = function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $urlRouterProvider
            .otherwise('/');

        //$locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');
    };

    var RootCtrl = function($rootScope){
        var that = this;
        that.activeRequests = 0;
        $rootScope.$on('requestSent', function(){
            that.activeRequests++;
        });
        $rootScope.$on('requestReturned', function(){
            that.activeRequests--;
        });
    };

    var authInterceptor = function($q, $cookies, $rootScope) {
        return {
            // Add authorization token to headers
            request: function (config) {
                $rootScope.$broadcast('requestSent');
                config.headers = config.headers || {};
                if ($cookies.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookies.get('token');
                }
                return config;
            },

            response: function(response) {
                $rootScope.$broadcast('requestReturned');
                return response;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                $rootScope.$broadcast('requestReturned');
                if(response.status === 401) {
                    // remove any stale tokens
                    $cookies.remove('token');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
        };
    };

    var MainSetup = function($cookies, $http, $rootScope, $state, Auth){
        var requestedState = null;
        $rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams){
            if (!Auth.isLoggedIn() && to.data.loggedOut){
                if (to.name != 'login'){
                    requestedState = null;
                }
                return;
            }
            else if (!Auth.isLoggedIn() && to.data.loggedIn){
                event.preventDefault();
                requestedState = to.name;
                $state.go('login');
            }
            else if (requestedState != null){
                event.preventDefault();
                var goTo = requestedState;
                requestedState = null;
                $state.go(goTo);
            }
            else if (Auth.isLoggedIn() && to.data.loggedIn){
                requestedState = null;
                return;
            }
            else if (Auth.isLoggedIn() && !to.data.loggedIn){
                event.preventDefault();
                requestedState = null;
                $state.go('main');
            }
        });
        $rootScope.$on('loggedIn', function(){
            if (requestedState == null){
                $state.go('main');
            }
            else{
                $state.go(requestedState);
            }
        });
    };

    angular.module('triApp')
        .factory('authInterceptor', authInterceptor)
        .controller('RootCtrl', RootCtrl)
        .config(MainConfig)
        .run(MainSetup);

})();
