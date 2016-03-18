'use strict';

(function(){

    var NavbarCtrl = function($scope, $location, $state, Auth){

        var currentAthlete = Auth.getCurrentAthlete();
        var isAdmin = currentAthlete.hasOwnProperty('role') && currentAthlete.role == 'admin';
        $scope.isLoggedIn = currentAthlete.hasOwnProperty('role');

        $scope.logout = function(){
            Auth.logout();
            if (!$state.current.data.loggedOut){
                $state.go('main');
            }
        };

        $scope.$watch(function(){return Auth.getCurrentAthlete()}, function(athlete){
            currentAthlete = athlete;
            isAdmin = currentAthlete.hasOwnProperty('role') && currentAthlete.role == 'admin';
            $scope.isLoggedIn = currentAthlete.hasOwnProperty('role');
            updateMenu();
        }, true);

        function updateMenu(){

            $scope.menu = $state.get().filter(function(d){
                return possibleMenus.indexOf(d.name) > -1 && 'data' in d && (($scope.isLoggedIn && d.data.loggedIn) || d.data.loggedOut);
            }).map(function(d){
                return {
                    title: d.data.title,
                    link: d.name
                };
            }).sort(function(d, e){
                return possibleMenus.indexOf(d.link) - possibleMenus.indexOf(e.link);
            });

        };

        var possibleMenus = [
            'main',
            'athletes',
            'training',
            'message'
        ];

        $scope.isCollapsed = true;

        $scope.isActive = function(route) {
            return route === $location.path();
        };

    };

    angular.module('triApp')
        .controller('NavbarCtrl', NavbarCtrl);

})();
