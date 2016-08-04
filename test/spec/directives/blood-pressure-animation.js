'use strict';

describe('Directive: bloodPressureAnimation', function () {

  // load the directive's module
  beforeEach(module('life.animations.blood-pressure'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<blood-pressure-animation></blood-pressure-animation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bloodPressureAnimation directive');
  }));
});
