'use strict';

var coreModule = angular.module('core');

// Core Controller
coreModule.controller('HomeController', ['$scope', 'Authentication', 'CardService', 
	function($scope, Authentication, CardService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		// Link to data service
		$scope.CardSRVC = CardService;
		
		var shiftLeft = function(event, object){
			$scope.CardSRVC.shiftLeft(object.index);
		};
		
		var shiftRight = function(event, object){
			$scope.CardSRVC.shiftRight(object.index);
		};
		
		var toggleOverlap = function(event, object){
			var _card = object.index;
			if(_card > 0){
				$scope.CardSRVC.toggleOverlap(object.index);
			}
		};
		
		$scope.$on('cardDeck:shiftLeft', shiftLeft);
		$scope.$on('cardDeck:shiftRight', shiftRight);
		$scope.$on('cardDeck:toggleOverlap', toggleOverlap);
	}
]);