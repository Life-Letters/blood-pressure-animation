'use strict';

/**
 * @ngdoc directive
 * @name animationBloodPressureApp.directive:bloodPressureAnimation
 * @description
 * # bloodPressureAnimation
 */
angular.module('animationBloodPressureApp')
  .directive('bloodPressureAnimation', function (P5, _) {
    return {
      template: '<div id="blood-pressure-animation"></div>',
      replace: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	var images = {};

      	var pressureNormalMin = 80;
      	var pressureNormalMax = 120;

      	var pressureValveMin = 0;
      	var pressureValveMax = 200;

      	var heartScaleChange = 0.2;
      	var heartbeatDuration = 2; // in seconds

      	var valveSize = -1;
      	var heartSize = -1;

        new P5(function(p) {

        	var pressure = 80;
        	var heartReadings = [];

        	function norm(val, min, max) {
        		return (val-min)/(max-min);
        	}

        	p.preload = function() {
        		images.heart 		= p.loadImage('images/icons_heart.png');
        		images.valve 		= p.loadImage('images/icons_valve.png');
        		images.needle 	= p.loadImage('images/icons_needle.png');
        	};
        	p.setup = function() {
        		p.createCanvas(element.prop('clientWidth'), element.prop('clientHeight'));
        		
        		valveSize = p.height * 0.2;
        		heartSize = p.height * 0.3;
        	};
        	p.draw = function() {
        		p.clear();

        		// Heart beat
        		pressure = pressureNormalMin + (p.sin(p.millis()/1000*2*p.PI/heartbeatDuration)+1)/2*(pressureNormalMax-pressureNormalMin);

        		heartReadings.push(pressure);
        		if (heartReadings.length > p.width) {
        			heartReadings = _.tail(heartReadings);
        		}
        		_.each(heartReadings, function(r, i) {
        			p.point(i, p.height - r);
        		});

        		var valveAmount = norm(pressure, pressureValveMin, pressureValveMax);

        		p.imageMode(p.CENTER);

				    p.applyMatrix();
				    p.translate(p.width/2, valveSize);
        		p.image(images.valve, 0,0,valveSize,valveSize);

        		p.angleMode(p.RADIANS);
				    p.rotate(p.PI*valveAmount - p.PI/2);
				    p.image(images.needle,0,0,valveSize,valveSize);
				    p.resetMatrix();

				    // Draw the heart:
				    var heartScale = 1 + norm(pressure, pressureNormalMin, pressureNormalMax) * heartScaleChange;
				    p.applyMatrix();
				    p.translate(p.width-heartSize, p.height-heartSize);
				    p.scale(heartScale)
        		p.image(images.heart,0,0,heartSize,heartSize);
        		p.resetMatrix();
        	};
        }, 'blood-pressure-animation');
      }
    };
  });
