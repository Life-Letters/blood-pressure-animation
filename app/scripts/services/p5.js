'use strict';

/**
 * @ngdoc service
 * @name animationBloodPressureApp.p5
 * @description
 * # p5
 * Factory in the animationBloodPressureApp.
 */
angular.module('animationBloodPressureApp')
  .factory('P5', function ($window) {
    return $window.p5;
  });