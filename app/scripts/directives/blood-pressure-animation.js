'use strict';

/**
 * @ngdoc directive
 * @name animationBloodPressureApp.directive:bloodPressureAnimation
 * @description
 * # bloodPressureAnimation
 */
angular.module('life.animations.blood-pressure', [
    'life.util.p5',
    'life.util.lodash',
  ])
  .directive('bloodPressureAnimation', function (P5, _, $timeout) {
    return {
      template: '<div id="{{ id }}"></div>',
      replace: true,
      restrict: 'E',
      scope: true,
      link: function postLink(scope, element, attrs) {
      	
        scope.id = '_bloodPressure-'+_.random(1000000,10000000);

        

        // Ensure the element has been instantiated
        $timeout(function() {
        	var width = element.prop('clientWidth'),
              height = width;

          if (!_.isUndefined(attrs.constrainHeight)) {
            // Ensure we take up as much space as permitted.
            element.css('position', 'absolute');
            element.css('top', 0);
            element.css('left', 0);
            element.css('height', '100%');
            element.css('width', '100%');

            // Fit within the smallest dimension
            height = element.prop('clientHeight');
            width = height = Math.min(width, height);
          }
        	
          new P5(function(p) {

            var pressureDiaMin = 40;
            var pressureDiaMax = 100;
            var pressureDiaRange = pressureDiaMax - pressureDiaMin;

            var pressureSysMin = 70;
            var pressureSysMax = 190;
            var pressureSysRange = pressureSysMax - pressureSysMin;

            var pressureAbsMin = pressureDiaMin;
            var pressureAbsMax = pressureSysMax;

  	      	var pressureValveMin = 0;
  	      	var pressureValveMax = 200;

  	      	var heartScaleChange = 0.3;
  	      	var heartbeatDuration = 1; // in seconds

            var pressureVariation = 0.5;
            var pressureCycleAuto = false; //true;
            var pressureCycleDuration = 30;

  	    		// Artery walls:
  	    		var arteryStretchDistance = height*0.05;
  	    		var arteryHeight = height*0.3;

  	    		var arteryMidY = height/2,
  	    				arteryTopY = arteryMidY - arteryHeight/2,
  	    				arteryBottomY = arteryMidY + arteryHeight/2;
          		
          	var heartSize = height * 0.2;

            var bloodCellBaseSize = height*0.04;
          	var bloodCellCount = 100;
          	var bloodCellSpeedMin = 5;
          	var bloodCellSpeedVariation = 15;
          	var bloodRotationAmount = p.PI*0.01;

            var sliderBgHeight = height*0.15;
            var sliderBgWidth = sliderBgHeight * 4; // must match the image ratio
            var sliderKnobSize = height*0.10;
            var sliderOffsetHor = (width-sliderBgWidth)/2;

          	var heartReadings = [];
          	var bloodCells = [];
          	var images = {};

            // Current state, updated per frame
            var sliderKnobOffset = 0;
            var pressureCurrent = 0;
            var pressureRatio = 0;

          	function BloodCell(position, scale) {
          		this.position = position;
          		this.scale = scale;
          		this.size = bloodCellBaseSize*scale;
          		this.rotation = p.PI*2*Math.random();
          	};

          	BloodCell.prototype = {
          		constructor: BloodCell,

          		draw: function(pressureRatio) {
          			this.position.x += this.scale * (bloodCellSpeedMin + bloodCellSpeedVariation * pressureRatio);

          			// Have we gone too far?
          			if ( this.position.x > width+this.size ) {
          				this.position.x = -this.size;
          			}

          			this.rotation += bloodRotationAmount;

          			p.fill(255, 0, 0);
          			p.applyMatrix();
          			p.translate(this.position.x, this.position.y);
          			p.rotate(this.rotation);
                p.imageMode(p.CENTER);
          			p.image(images.bloodCell, 0, 0, this.size, this.size);
          			p.resetMatrix();
          		},
          	}

          	p.preload = function() {
          		images.heart 			= p.loadImage('blood-pressure-assets/images/icons_heart.png');
          		images.valve 			= p.loadImage('blood-pressure-assets/images/icons_valve.png');
          		images.needle 		= p.loadImage('blood-pressure-assets/images/icons_needle.png');
          		images.bloodCell 	= p.loadImage('blood-pressure-assets/images/icon_blood-cell.png');
          		images.overlay 		= p.loadImage('blood-pressure-assets/images/overlay.png');
              images.sliderBg   = p.loadImage('blood-pressure-assets/images/slider-bg.png');
              images.sliderKnob = p.loadImage('blood-pressure-assets/images/slider-knob.png');
          	};
          	p.setup = function() {
          		p.createCanvas(width, height);
          		p.frameRate(30);

          		_.times(bloodCellCount, function(i) {
          			var yMin = arteryTopY, //-arteryStretchDistance,
          					yMax = arteryBottomY, //+arteryStretchDistance,
          					yRange = yMax-yMin,
          					// An s-curve (with some randomness), to position cells mostly towards the center.
                    x = Math.random(),
          					y = (0.6 - 3*Math.pow(x-0.5,3) - 0.2*x) * yRange + yMin;

          			bloodCells.push(
          					new BloodCell(
          						p.createVector(p.random(width), y), 
          						1+(i/bloodCellCount)
          					)
          				);
          		});
          	};
            var knobDragX = -1;
            p.mousePressed = function() {
              if (p.mouseX > sliderKnobOffset && 
                  p.mouseX < sliderKnobOffset + sliderKnobSize &&
                  p.mouseY > height-sliderBgHeight/2-sliderKnobSize/2 &&
                  p.mouseY < height-sliderBgHeight/2+sliderKnobSize/2) {
                pressureCycleAuto = false;
                knobDragX = Math.max(0, p.mouseX);
              }
            };
            p.mouseReleased = function() {
              knobDragX = -1;
            };
            p.mouseDragged = function() {
              if ( knobDragX < 0 ) { return; }
              pressureVariation = p.constrain(p.norm(p.mouseX, sliderOffsetHor+sliderKnobSize/2, sliderOffsetHor+sliderBgWidth-sliderKnobSize/2), 0, 1);
            };
          	p.draw = function() {

              if (pressureCycleAuto) {
                pressureVariation = (p.cos(p.millis()/1000*p.TWO_PI/pressureCycleDuration-p.PI/2) + 1) / 2;
              }
              var pressureMin = pressureVariation*pressureDiaRange+pressureDiaMin;
              var pressureMax = pressureVariation*pressureSysRange+pressureSysMin;

          		// Heart beat
          		var heartbeat = (p.cos(p.millis()/1000*p.TWO_PI/heartbeatDuration) + 1) / 2;
              pressureCurrent = heartbeat*(pressureMax-pressureMin)+pressureMin;
              pressureRatio = p.norm(pressureCurrent, pressureAbsMin, pressureAbsMax);
              sliderKnobOffset = sliderOffsetHor + (sliderBgWidth - sliderKnobSize) * pressureVariation;
          		
              // Cardiograph
              // heartReadings.push(pressureCurrent);
              // if (heartReadings.length > width) {
              // 	heartReadings = _.tail(heartReadings);
              // }
              // _.each(heartReadings, function(r, i) {
              // 	p.point(i, height - r);
              // });

          		p.background(250,170,160);

          		// Blood cells:
          		_.each(bloodCells, function(cell) {
          			cell.draw(pressureRatio);
          		});

          		// Artery (in reverse, i.e. we draw the surrounding whitespace)
      				var arteryBendCtrPt = arteryStretchDistance * pressureRatio;
          		p.fill(255);
          		p.stroke(200,70,50);
          		p.strokeWeight(5);
              // Top wall
  						p.beginShape();
  						p.curveVertex(-width, -height);
  						p.curveVertex(-width, -height);
  						p.curveVertex(-width, arteryTopY);
  						p.curveVertex(0, arteryTopY);
  						p.curveVertex(width*0.5, arteryTopY-arteryBendCtrPt);
  						p.curveVertex(width, arteryTopY);
  						p.curveVertex(2*width, arteryTopY);
  						p.curveVertex(2*width, -height);
  						p.curveVertex(2*width, -height);
  						p.endShape();
              // Bottom wall
  						p.beginShape();
  						p.curveVertex(2*width, height*2);
  						p.curveVertex(2*width, height*2);
  						p.curveVertex(2*width, arteryBottomY);
  						p.curveVertex(width, arteryBottomY);
  						p.curveVertex(width*0.5, arteryBottomY+arteryBendCtrPt);
  						p.curveVertex(0, arteryBottomY);
  						p.curveVertex(-width, arteryBottomY);
  						p.curveVertex(-width, height*2);
  						p.curveVertex(-width, height*2);
  						p.endShape();
              // Magnifying glass
  						p.imageMode(p.CORNER);
  						p.image(images.overlay, 0, 0, width, height);

  				    // Draw the heart:
  				    var heartScale = 1 - pressureRatio * heartScaleChange;
  				    p.applyMatrix();
  				    p.translate(heartSize*0.45, height/2);
  				    p.scale(heartScale);
  				    p.imageMode(p.CENTER);
          		p.image(images.heart,0,0,heartSize,heartSize);
          		p.resetMatrix();

          		// Valve
              var valveAmount = p.norm(pressureCurrent, pressureValveMin, pressureValveMax);
              var valveSize = height * 0.1;
          		p.applyMatrix();
  				    p.translate(heartSize*0.45, height*0.325);
          		// p.image(images.valve,0,0,valveSize,valveSize);
          		// Needle
          		p.angleMode(p.RADIANS);
  				    p.rotate(p.PI*valveAmount - p.PI/2);
  				    p.imageMode(p.CENTER);
  				    p.image(images.needle,0,0,valveSize,valveSize);
  				    p.resetMatrix();

              // Draw the slider:
              p.imageMode(p.CORNER);
              p.image(images.sliderBg, sliderOffsetHor, height-sliderBgHeight, sliderBgWidth, sliderBgHeight);
              p.imageMode(p.CENTER);
              p.image(images.sliderKnob, sliderKnobSize/2+sliderKnobOffset, height-sliderBgHeight/2, sliderKnobSize, sliderKnobSize);

              p.fill(0);
              p.noStroke();
              p.textFont('Helvetica');
              p.textAlign(p.CENTER);
              p.textSize(height/10);
              p.text(Math.round(pressureMax)+'/'+Math.round(pressureMin), 0, 0, width, height*0.4);
              p.textSize(height/40);
              p.text('systolic / diastolic', 0, height*0.1, width, height*0.4);


          	};
          }, scope.id);
        });
      }
    };
  });
