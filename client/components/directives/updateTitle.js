'use strict';

(function(){
    /**
     * @ngInject
     */
    var updateTitle = function($rootScope, $timeout) {
        return {
            link: function(scope, element) {

                var listener = function(event, toState, toParams, fromState, fromParams) {
                    var title = 'Dingo Tri Club';
                    if (toState.data && toState.data.title){
                        title += (' - ' + toState.data.title);
                    }
                    // Set asynchronously so page changes before title does
                    $timeout(function() {
                        element.text(title);
                    });
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        }
    };

    angular
        .module('triApp')
        .directive('updateTitle', updateTitle);

})();
