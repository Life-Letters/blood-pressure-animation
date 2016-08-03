'use strict';

/**
 * @ngdoc directive
 * @name animationBloodPressureApp.directive:bloodPressureAnimation
 * @description
 * # bloodPressureAnimation
 */
angular.module('animationBloodPressureApp')
  .directive('bloodPressureAnimation', function () {
    return {
      template: '<div id="blood-pressure-animation"></div>',
      replace: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        new p5(function(p) {
        	p.setup = function() {
        		console.log(element.prop('clientWidth'), element.prop('clientHeight'));
        		p.createCanvas(element.prop('clientWidth'), element.prop('clientHeight'));
        	};
        	p.draw = function() {
        		p.ellipse(p.mouseX, p.mouseY, 10, 10);
        	};
        }, 'blood-pressure-animation');
      }
    };
  });
