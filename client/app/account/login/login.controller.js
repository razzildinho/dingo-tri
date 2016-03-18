'use strict';

angular.module('triApp')
  .controller('LoginCtrl', function ($scope, $state, $rootScope, Auth) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $rootScope.$broadcast('loggedIn');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
