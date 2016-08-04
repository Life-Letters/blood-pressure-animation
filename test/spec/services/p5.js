'use strict';

describe('Service: p5', function () {

  // load the service's module
  beforeEach(module('life.animations.blood-pressure'));

  // instantiate service
  var p5;
  beforeEach(inject(function (_p5_) {
    p5 = _p5_;
  }));

  it('should do something', function () {
    expect(!!p5).toBe(true);
  });

});
