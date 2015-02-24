'use strict';

// npc-origin directive
angular.module('cards')
	.directive('npcOrigin', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/npc-origin.html'
		};
	})
	.directive('originStats', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/origin-stats.html'
		};
	})
	.directive('originDefenses', function(){
		return {
			restrict: 'A',
			templateUrl: '../modules/cards/views/origin-defenses.html'
		};
	});