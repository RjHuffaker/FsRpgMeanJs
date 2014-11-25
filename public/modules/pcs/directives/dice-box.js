'use strict';

angular.module('core')
	.directive('diceBox', function() {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-box.html'
		};
	});