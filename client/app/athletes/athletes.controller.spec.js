'use strict';

describe('Controller: AthletesCtrl', function () {

  // load the controller's module
  beforeEach(module('triApp'));

  var AthletesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AthletesCtrl = $controller('AthletesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
