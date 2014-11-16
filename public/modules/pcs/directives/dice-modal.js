'use strict';

angular.module('core')
	.directive('diceModal', function() {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/dice-modal.html'
		};
	});