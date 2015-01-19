'use strict';

var pcsModule = angular.module('pcs');

// Directive for managing card decks.
pcsModule
	.directive('diceBox', function() {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-box.html'
		};
	});