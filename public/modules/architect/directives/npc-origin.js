'use strict';

// npc-origin directive
angular.module('architect')
	.directive('npcOrigin', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/npc-origin.html'
		};
	})
	.directive('originStats', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/origin-stats.html'
		};
	})
	.directive('originDefenses', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/architect/views/origin-defenses.html'
		};
	});