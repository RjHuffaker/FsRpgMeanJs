'use strict';

// Directive for managing modal deck
angular.module('pcs')
	.directive('modalDeck', ['$window', 'CardDeck', function($window, CardDeck) {
		return {
			restrict: 'A',
			templateUrl: '../modules/pcs/views/modal-deck.html',
			link: function(scope, element, attrs) {
				
			}
		};
	}]);