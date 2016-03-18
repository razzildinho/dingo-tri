'use strict';

angular.module('triApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('message', {
        url: '/message',
        templateUrl: 'app/message/message.html',
        controller: 'MessageCtrl',
        data: {
            title: 'Messages',
            loggedIn: true,
            loggedOut: false,
        },
      });
  });
