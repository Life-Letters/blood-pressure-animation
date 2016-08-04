'use strict';

/**
 * @ngdoc service
 * @name animationBloodPressureApp.lodash
 * @description
 * # lodash
 * Factory in the animationBloodPressureApp.
 */
angular.module('animationBloodPressureApp')
  .factory('_', function ($window) {
    return $window._;
  });
