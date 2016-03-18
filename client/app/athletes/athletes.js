'use strict';

angular.module('triApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('athletes', {
        url: '/athletes',
        templateUrl: 'app/athletes/athletes.html',
        controller: 'AthletesCtrl',
        data: {
            title: 'Athletes',
            loggedIn: true,
            loggedOut: true,
        },
      });
  });
