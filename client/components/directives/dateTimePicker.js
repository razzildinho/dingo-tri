'use strict';

(function(){
    /**
     * @ngInject
     */
    var dateTimePicker = function($rootScope, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            template: '<div class="input-group date"><input type="text" ng-model="vistime" class="form-control" /><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div>',
            link: function($scope, $element, $attrs, ngModelCtrl) {
                $scope.vistime = moment(new Date()).format('DD/MM/YY HH:mm');
                ngModelCtrl.$setViewValue(moment($scope.vistime, 'DD/MM/YY HH:mm').toDate());

                var dtp = $element.find('div').datetimepicker({
                    minDate: new Date(),
                    format: "DD/MM/YYYY HH:mm",
                    allowInputToggle: true,
                });

                $element.find('input').on('focus', function(){return});

                dtp.on('dp.change', function(newTime){
                    $scope.vistime = moment(newTime.date._d).format('DD/MM/YY HH:mm');
                    ngModelCtrl.$setViewValue(moment($scope.vistime, 'DD/MM/YY HH:mm').toDate());
                    $rootScope.$digest();
                });

            }
        }
    };

    angular
        .module('triApp')
        .directive('dateTimePicker', dateTimePicker);

})();
