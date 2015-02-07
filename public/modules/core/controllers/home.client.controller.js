'use strict';

// Core Controller
angular.module('core')
	.controller('HomeController', ['$scope', 'Authentication', 'CardDeck', 'HomeDemo',
		function($scope, Authentication, CardDeck, HomeDemo) {
			// This provides Authentication context.
			$scope.authentication = Authentication;
			
			$scope.cardDeck = CardDeck;
			
			$scope.homeDemo = HomeDemo;
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if(!enable) return;
				$scope.$on('$destroy', onDestroy);
			};
			
			var onDestroy = function(){
				toggleListeners(false);
			};
			
			initialize();
			
		}
	]);