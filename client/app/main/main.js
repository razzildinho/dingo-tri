'use strict';

angular.module('triApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        data: {
            title: 'Home',
            loggedIn: true,
            loggedOut: true,
        },
      });
  });
