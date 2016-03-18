'use strict';

describe('Service: athletes', function () {

  // load the service's module
  beforeEach(module('triApp'));

  // instantiate service
  var athletes;
  beforeEach(inject(function (_athletes_) {
    athletes = _athletes_;
  }));

  it('should do something', function () {
    expect(!!athletes).toBe(true);
  });

});
