'use strict';

angular.module('triApp')
  .controller('TrainingCtrl', function ($scope, Auth) {
    $scope.message = 'Hello';
    $scope.$watch(function(){return Auth.isAthlete()}, function(isAthlete){
        $scope.isAthlete = isAthlete;
    });
    $scope.discipline = 'swim';
  });
