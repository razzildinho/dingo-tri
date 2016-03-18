'use strict';

describe('Service: training', function () {

  // load the service's module
  beforeEach(module('triApp'));

  // instantiate service
  var training;
  beforeEach(inject(function (_training_) {
    training = _training_;
  }));

  it('should do something', function () {
    expect(!!training).toBe(true);
  });

});
