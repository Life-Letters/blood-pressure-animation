'use strict';

/**
 * @ngdoc service
 * @name animationBloodPressureApp.lodash
 * @description
 * # lodash
 * Factory in the animationBloodPressureApp.
 */
angular.module('life.animations.blood-pressure')
  .factory('_', function ($window) {
    return $window._;
  });