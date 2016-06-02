'use strict';

angular.module('triApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('training', {
        url: '/training',
        templateUrl: 'app/training/training.html',
        controller: 'TrainingCtrl',
        data: {
            title: 'Training',
            loggedIn: true,
            loggedOut: true,
        },
      });
  });
