'use strict';

(function(){

    var message = function($http, $q, $timeout, socket, Auth){
        var service = {};

        service.messages = [];

        service.load = function(){

            var deferred = $q.defer();

            $http.get('/api/messages').success(function(data){
                data.sort(function(a,b){
                    a = new Date(a.date);
                    b = new Date(b.date);
                    return a>b ? -1 : a<b ? 1 : 0;
                });
                service.messages = data;
                socket.syncUpdates('message', service.messages, function(event, message, messages){
                    messages.sort(function(a,b){
                        a = new Date(a.date);
                        b = new Date(b.date);
                        return a>b ? -1 : a<b ? 1 : 0;
                    });
                });
                deferred.resolve(data);
            });

            return deferred.promise;
        };

        service.post = function(message){

            var deferred = $q.defer();

            var params = {
                _athlete: Auth.getCurrentAthlete()._id,
                message: message
            }

            $http.post('/api/messages', params).success(function(data){
                deferred.resolve(data);
            });

            return deferred.promise;
        };

        service.delete = function(_id){

            var deferred = $q.defer();

            $http.delete('/api/messages/'+_id).success(function(data){
                deferred.resolve(data);
            });

            return deferred.promise;

        };

        return service;
    }
    angular.module('triApp')
        .service('message', message);

})();

