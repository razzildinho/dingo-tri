'use strict';

angular.module('triApp')
  .service('training', function ($q, $http, Auth) {

        var service = {};

        service.unregistered = [];

        service.upcoming = function(){

            var deferred = $q.defer();

            $http.get('/api/training/upcoming').success(function(data){
                deferred.resolve(data);
            }).error(function(err){
                deferred.reject(err);
            });

            return deferred.promise;

        };

        service.addSession = function(req){

            var deferred = $q.defer();

            req._athlete = Auth.getCurrentAthlete()._id;

            $http.post('/api/training', req).success(function(data){
                deferred.resolve(data);
            }).error(function(err){
                deferred.reject(err);
            });

            return deferred.promise;

        };

        return service;

  });
