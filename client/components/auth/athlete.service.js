'use strict';

angular.module('triApp')
    .factory('Athlete', function ($resource) {
        return $resource('/api/athletes/:id/:controller', {
            id: '@_id'
        },
        {
            changePassword: {
                method: 'PUT',
                params: {
                    controller:'password'
                }
            },
            get: {
                method: 'GET',
                params: {
                    id:'me'
                }
            }
	    });
    });
