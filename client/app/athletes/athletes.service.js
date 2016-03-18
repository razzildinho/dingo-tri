'use strict';

(function(){

    var athletes = function($q, $http, socket){

        var service = {};

        service.unregistered = [];

        service.get = function(){

            var deferred = $q.defer();

            $http.get('/api/athletes').success(function(data){
                deferred.resolve(data);
            });

            return deferred.promise;

        };

        service.getUnregistered = function(){

            var deferred = $q.defer();

            $http.get('/api/athletes/unregistered').success(function(data){

                service.unregistered = data;

                socket.syncUpdates('athlete', service.unregistered, function(event, athlete, athletes){
                    athletes.filter(function(a){
                        return a.role != 'admin';
                    });
                });

                deferred.resolve(data);
            });

            return deferred.promise;

        };

        service.activate = function(_id, role){

            var deferred = $q.defer();

            $http.put('/api/athletes/activate/'+_id, {role: role}).success(function(data){
                deferred.resolve(data);
            });

            return deferred.promise;

        };

        service.delete = function(_id){

            var deferred = $q.defer();

            $http.delete('/api/athletes/'+_id).success(function(data){
                deferred.resolve(data);
            });

            return deferred.promise;

        };

        service.update = function(athlete){

            var deferred = $q.defer();

            $http.put('/api/athletes/'+athlete._id, athlete).success(function(data){
                deferred.resolve(data);
            });

            return deferred.promise;

        };

        service.photo = function(athlete){

            var deferred = $q.defer();

            var image = document.getElementById('newImage').files[0];
            var reader = new FileReader();
            reader.onloadend = function(e){
                var upload = e.target.result;
                var formData = {
                    image: upload,
                };
                $http.put('/api/athletes/'+athlete._id+'/photo', formData).success(function(res){
                    deferred.resolve(res);
                }).error(function(){
                });
            }
            reader.readAsDataURL(image);

            return deferred.promise;

        };

        return service;

    }

    angular.module('triApp')
        .service('athletes', athletes)

})();

