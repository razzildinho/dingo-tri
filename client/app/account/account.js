'use strict';

angular.module('triApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl',
        data: {
            title: 'Log in',
            loggedIn: false,
            loggedOut: true,
        },
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl',
        data: {
            title: 'Register',
            loggedIn: false,
            loggedOut: true,
        },
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        data: {
            title: 'Settings',
            loggedIn: true,
            loggedOut: false,
        },
      });
  });
