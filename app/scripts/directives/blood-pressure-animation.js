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
      	
      	function norm(val, min, max) {
      		return (val-min)/(max-min);
      	}

      	var width = element.prop('clientWidth'), 
      			height = element.prop('clientHeight');
      	
        new P5(function(p) {

        	var pressureNormalMin = 80;
	      	var pressureNormalMax = 120;
	      	var pressureHighMin = 100;
	      	var pressureHighMax = 180;

	      	var pressureValveMin = 0;
	      	var pressureValveMax = 200;

	      	var heartScaleChange = 0.2;
	      	var heartbeatDuration = 2; // in seconds

	    		// Artery walls:
	    		var arteryStretchDistance = 20;
	    		var arteryWidth = 60, 
	    				arteryHalfWidth = arteryWidth/2;

	    		var arteryMidY = height/2,
	    				arteryTopY = arteryMidY - arteryWidth/2,
	    				arteryBottomY = arteryMidY + arteryWidth/2;
        		
        	var valveSize = height * 0.2;
        	var heartSize = height * 0.35;

        	var bloodCellCount = 100;
        	var bloodCellSpeedMin = 5;
        	var bloodCellSpeedVariation = 15;
        	var bloodRotationAmount = p.PI*0.01;

        	var pressure = 80;
        	var heartReadings = [];
        	var bloodCells = [];
        	var images = {};

        	function BloodCell(position, scale) {
        		this.position = position;
        		this.scale = scale;
        		this.size = 10*scale;
        		this.rotation = p.PI*2*Math.random();
        	};

        	BloodCell.prototype = {
        		constructor: BloodCell,

        		draw: function(pressure) {
        			this.position.x += this.scale * (bloodCellSpeedMin + bloodCellSpeedVariation * norm(pressure, pressureNormalMin, pressureHighMax));

        			// Have we gone too far?
        			if ( this.position.x > width+this.size ) {
        				this.position.x = -this.size;
        			}

        			this.rotation += bloodRotationAmount;

        			p.fill(255, 0, 0);
        			p.imageMode(p.CENTER);
        			p.applyMatrix();
        			p.translate(this.position.x, this.position.y);
        			p.rotate(this.rotation);
        			p.image(images.bloodCell, 0, 0, this.size, this.size);
        			p.resetMatrix();
        		},
        	}

        	p.preload = function() {
        		images.heart 			= p.loadImage('images/icons_heart.png');
        		images.valve 			= p.loadImage('images/icons_valve.png');
        		images.needle 		= p.loadImage('images/icons_needle.png');
        		images.bloodCell 	= p.loadImage('images/icon_blood-cell.png');
        		images.overlay 		= p.loadImage('images/overlay.png');
        	};
        	p.setup = function() {
        		p.createCanvas(width, height);
        		p.frameRate(30);

        		_.times(bloodCellCount, function(i) {
        			bloodCells.push(
        					new BloodCell(
        						p.createVector(
        							p.random(width), 
        							p.random(arteryTopY-arteryStretchDistance, arteryBottomY+arteryStretchDistance)), 
        						1+(i/bloodCellCount)
        					)
        				);
        		});
        	};
        	p.draw = function() {
        		p.clear();
        		p.imageMode(p.CENTER);

        		// Heart beat
        		// TODO: change to something more heartbeaty
        		pressure = pressureNormalMin + (p.sin(p.millis()/1000*2*p.PI/heartbeatDuration)+1)/2*(pressureNormalMax-pressureNormalMin);

        		heartReadings.push(pressure);
        		if (heartReadings.length > width) {
        			heartReadings = _.tail(heartReadings);
        		}
        		_.each(heartReadings, function(r, i) {
        			p.point(i, height - r);
        		});

        		var valveAmount = norm(pressure, pressureValveMin, pressureValveMax);

        		// p.strokeWeight(2);
        		// p.stroke(0);
        		// // Gague pipe
        		// p.line(width/2-2, valveSize, width/2-2, height/2);
        		// p.line(width/2+2, valveSize, width/2+2, height/2);


        		// p.curve(width*-0.5, arteryTopY+arteryBendCtrPt, 
        		// 		0, arteryTopY, 
        		// 		width, arteryTopY, 
        		// 		width*1.5, arteryTopY+arteryBendCtrPt);
        		// p.curve(width*-0.5, arteryBottomY-arteryBendCtrPt, 
        		// 		0, arteryBottomY, 
        		// 		width, arteryBottomY, 
        		// 		width*1.5, arteryBottomY-arteryBendCtrPt);
        		
        		p.background(250,170,160);

        		// Blood cells:
        		_.each(bloodCells, function(cell) {
        			cell.draw(pressure);
        		});

        		// Artery (in reverse, i.e. we draw the surrounding whitespace)
    				var arteryBendCtrPt = arteryStretchDistance * norm(pressure, pressureNormalMin, pressureHighMax);
        		p.fill(255);
        		p.stroke(200,70,50);
        		p.strokeWeight(5);
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

						p.imageMode(p.CORNER);
						p.image(images.overlay, 0, 0, width, height);

				    // Draw the heart:
				    var heartScale = 1 + norm(pressure, pressureNormalMin, pressureNormalMax) * heartScaleChange;
				    p.applyMatrix();
				    p.translate(width-heartSize/2-valveSize/4, height-heartSize/2-valveSize/4);
				    p.scale(heartScale);
				    p.imageMode(p.CENTER);
        		p.image(images.heart,0,0,heartSize,heartSize);
        		p.resetMatrix();

        		// Valve
        		p.applyMatrix();
				    p.translate(width-valveSize/2-5, height-valveSize/2-5);
        		p.image(images.valve,0,0,valveSize,valveSize);
        		// Needle
        		p.angleMode(p.RADIANS);
				    p.rotate(p.PI*valveAmount - p.PI/2);
				    p.imageMode(p.CENTER);
				    p.image(images.needle,0,0,valveSize,valveSize);
				    p.resetMatrix();
        	};
        }, 'blood-pressure-animation');
      }
    };
  });
