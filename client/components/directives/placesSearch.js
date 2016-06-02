'use strict';

(function(){
    /**
     * @ngInject
     */
    var placesSearch = function($rootScope, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            template: '<input class="form-control" ng-model="place"></input>',
            link: function($scope, $element, $attrs, ngModelCtrl) {

                var boundsPts = [
                    new google.maps.LatLng(53.371879, -6.347110),
                    new google.maps.LatLng(53.413354, -6.017582),
                    new google.maps.LatLng(53.267262, -6.105257),
                    new google.maps.LatLng(53.268946, -6.321984), 
                ];
                var bounds = new google.maps.LatLngBounds();
                boundsPts.forEach(function(d){
                    bounds.extend(d);
                });

                var searchBox = new google.maps.places.Autocomplete($element.find('input')[0], {
                    types: ['geocode'],
                    bounds: bounds
                });
                google.maps.event.addListener(searchBox, 'place_changed', function(){
                    if ('geometry' in searchBox.getPlace()){
                        ngModelCtrl.$setViewValue(searchBox.getPlace());
                        ngModelCtrl.$setValidity('fromGoogle', true);
                        $rootScope.$digest();
                    }
                });

                $scope.place = null;
                var firstRun = true;
                $scope.$watch('place', function(place){
                    ngModelCtrl.$setViewValue(place);
                    if (firstRun){
                        ngModelCtrl.$setPristine();
                        firstRun = false;
                        return;
                    }
                    ngModelCtrl.$setValidity('fromGoogle', false);
                })
            }
        }
    };

    angular
        .module('triApp')
        .directive('placesSearch', placesSearch);

})();
