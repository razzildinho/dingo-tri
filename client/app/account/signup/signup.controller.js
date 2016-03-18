'use strict';

angular.module('triApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.athlete = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createAthlete({
          name: $scope.athlete.name,
          email: $scope.athlete.email,
          hashedPassword: $scope.athlete.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });
