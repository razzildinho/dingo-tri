'use strict';

angular.module('triApp')
  .controller('TrainingCtrl', function ($scope, Auth, training) {
    $scope.message = 'Hello';
    $scope.$watch(function(){return Auth.isAthlete()}, function(isAthlete){
        $scope.isAthlete = isAthlete;
    });
    $scope.$watch(function(){return Auth.isAdmin()}, function(isAdmin){
        $scope.isAdmin = isAdmin;
    });
    $scope.$watch(function(){return Auth.getCurrentAthlete()}, function(athlete){
        $scope._athlete = athlete._id;
    });
    $scope.session = {
        discipline: 'swim',
        location: null,
        time: null,
        description: null,
    };

    training.upcoming().then(
        function(res){
            $scope.sessions = res;
        },
        function(err){
            console.log(err);
        }
    );

    $scope.addActivity = function(){

        var formData = {
            time: $scope.session.time,
            location: $scope.session.location,
            description: $scope.session.description,
            discipline: $scope.session.discipline,
        };

        training.addSession(formData).then(
            function(res){
                $scope.showForm = false;
                training.upcoming().then(
                    function(res){
                        $scope.sessions = res;
                    },
                    function(err){
                        console.log(err);
                    }
                );
            },
            function(err){
                console.log(err);
            }
        );
    };

    $scope.deleteSession = function(session){
        if (!(Auth.isAdmin() || Auth.getCurrentAthlete()._id == session._athlete)){
            return;
        }
        training.deleteSession(session._id).then(
            function(res){
                training.upcoming().then(
                    function(res){
                        $scope.sessions = res;
                    },
                    function(err){
                        console.log(err);
                    }
                );
            },
            function(err){
                console.log(err);
            }
        );
    };

  });
