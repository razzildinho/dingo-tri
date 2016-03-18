'use strict';

(function(){

    var AthletesCtrl = function ($scope, athletes) {

        athletes.get().then(function(data){
            $scope.athletes = data;
        });

        $scope.random = function(){
            return 0.5 - Math.random();
        };
    
    };

    angular.module('triApp')
        .controller('AthletesCtrl', AthletesCtrl);

})();

