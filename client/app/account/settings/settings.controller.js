'use strict';

(function(){

    var SettingsCtrl = function ($scope, Athlete, Auth, athletes) {
        $scope.errors = {};

        $scope.isAdmin = Auth.isAdmin();
        $scope.currentAthlete = Auth.getCurrentAthlete();
        $scope.athleteService = athletes;

        if ($scope.isAdmin){
            athletes.getUnregistered().then(function(data){
                $scope.athletes = data;
                $scope.$watch('athleteService.unregistered', function(newAthletes){
                    $scope.athletes = newAthletes;
                });
            });
        }

        $scope.delete = function(_id){
            athletes.delete(_id);
        };

        $scope.activate = function(athlete){
            athletes.activate(athlete._id, athlete.role);
        };

        $scope.passwordChanged = false;

        $scope.changePassword = function(form) {
            $scope.submitted = true;
            if(form.$valid) {
                Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
                    .then( function() {
                        $scope.passwordMessage = 'Password successfully changed.';
                        $scope.user.oldPassword = null;
                        $scope.user.newPassword = null;
                        form.$setPristine();
                        form.$setUntouched();
                        $scope.errors.other = '';
                        $scope.passwordChanged = true;
                    })
                    .catch( function() {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Incorrect password';
                        $scope.message = '';
                    });
            }
        };

        $scope.update = function(){
            athletes.update($scope.currentAthlete).then(function(data){
                $scope.updateMessage = 'Successfully updated.';
                $scope.currentAthlete = data;
                Auth.refreshCurrentAthlete();
            });
        };

        $scope.photo = function(){
            $scope.photoMessage = null;
            athletes.photo($scope.currentAthlete).then(function(data){
                $scope.photoMessage = 'Successfully uploaded.';
            });
        };
    };

    angular.module('triApp')
        .controller('SettingsCtrl', SettingsCtrl);

})();
