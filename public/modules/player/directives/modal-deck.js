'use strict';

// Directive for managing modal deck
angular.module('player')
	.directive('modalDeck', ['$window', 'CardDeck', function($window, CardDeck) {
		return {
			restrict: 'A',
			templateUrl: '../modules/player/views/modal-deck.html',
			link: function(scope, element, attrs) {
				
			}
		};
	}]);