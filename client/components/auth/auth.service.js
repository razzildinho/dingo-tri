'use strict';

(function(){

    var Auth = function Auth($location, $rootScope, $http, Athlete, $cookies, $q, jwtHelper) {

        var currentAthlete = {};

        if($cookies.get('token')) {
            currentAthlete = Athlete.get(function(res){
                currentAthlete = res;
                if (currentAthlete.hasOwnProperty('role')){
                    $rootScope.$broadcast('loggedIn');
                }
            });
        }

        return {

            /**
             * Authenticate athlete and save token
             *
             * @param  {Object}   athlete     - login info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            login: function(athlete, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();

                $http.post('/auth/local', {
                    email: athlete.email,
                    password: athlete.password
                }).success(function(data) {
                    var expireDate = jwtHelper.getTokenExpirationDate(data.token);
                    $cookies.put('token', data.token, {
                        expires: expireDate
                    });
                    Athlete.get(function(res){
                        currentAthlete = res;
                        deferred.resolve(data);
                    });
                    return cb();
                }).error(function(err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

                return deferred.promise;
            },

            /**
             * Delete access token and athlete info
             *
             * @param  {Function}
             */
            logout: function() {
                $cookies.remove('token');
                currentAthlete = {};
            },

            /**
             * Create a new athlete
             *
             * @param  {Object}   athlete     - athlete info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            createAthlete: function(athlete, callback) {
                var cb = callback || angular.noop;

                return Athlete.save(athlete,
                    function(data) {
                        $cookies.put('token', data.token);
                        Athlete.get(function(res){
                            currentAthlete = res;
                        });
                        return cb(athlete);
                    },
                    function(err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },

            /**
             * Change password
             *
             * @param  {String}   oldPassword
             * @param  {String}   newPassword
             * @param  {Function} callback    - optional
             * @return {Promise}
             */
            changePassword: function(oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;

                return Athlete.changePassword({ id: currentAthlete._id }, {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(athlete) {
                    return cb(athlete);
                }, function(err) {
                    return cb(err);
                }).$promise;
            },

            /**
             * Gets all available info on authenticated athlete
             *
             * @return {Object} athlete
             */
            getCurrentAthlete: function() {
                return currentAthlete;
            },

            refreshCurrentAthlete: function(){
                currentAthlete = Athlete.get();
            },

            /**
             * Check if a athlete is logged in
             *
             * @return {Boolean}
             */
            isLoggedIn: function() {
                return currentAthlete.hasOwnProperty('role');
            },

            /**
             * Waits for currentAthlete to resolve before checking if athlete is logged in
             */
            isLoggedInAsync: function(cb) {
                if (currentAthlete.hasOwnProperty('$promise')) {
                    currentAthlete.$promise.then(function() {
                        cb(true);
                    }).catch(function() {
                        cb(false);
                    });
                } 
                else if (currentAthlete.hasOwnProperty('role')) {
                    cb(true);
                } 
                else {
                    cb(false);
                }
            },

            /**
             * Check if a athlete is an admin
             *
             * @return {Boolean}
             */
            isAdmin: function() {
                return currentAthlete.role === 'admin';
            },

            isAthlete: function() {
                return currentAthlete.role === 'admin' || currentAthlete.role === 'user';
            },

            /**
             * Get auth token
             */
            getToken: function() {
                return $cookies.get('token');
            }
        };
    };

    angular.module('triApp')
        .factory('Auth', Auth);

})();
