'use strict';

(function(){

    var MessageCtrl = function ($scope, socket, message, Auth) {
        message.load().then(function(data){
            $scope.messages = data;
            $scope.athlete = Auth.getCurrentAthlete()._id;
            $scope.isAdmin = Auth.isAdmin();
            $scope.messageService = message;
            $scope.$watch('messageService.messages', function(newMessages){
                $scope.messages = newMessages;
            })
        })

        $scope.newMessage = null;

        $scope.post = function(){
            message.post($scope.newMessage).then(function(){
                $scope.newMessage = null;
            });
        };

        $scope.delete = function(_id){
            message.delete(_id);
        }
    };

    angular.module('triApp')
        .controller('MessageCtrl', MessageCtrl);

})();

