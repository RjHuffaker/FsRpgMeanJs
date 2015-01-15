'use strict';

var coreModule = angular.module('core');

// Core Controller
coreModule.controller('HomeController', ['$scope', 'Authentication', 'CardDeck', 'HomeDemo',
	function($scope, Authentication, CardDeck, HomeDemo) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		$scope.cardDeck = CardDeck;
		
		$scope.homeDemo = HomeDemo;
		
		$scope.windowHeight = 0;
		
		$scope.windowScale = 0;
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$scope.$on('$destroy', onDestroy);
			$scope.$on('screenSize:onHeightChange', onHeightChange);
		};
		
		var onDestroy = function(){
			toggleListeners(false);
		};
		
		var onHeightChange = function(event, object){
			$scope.windowHeight = object.newHeight;
			$scope.windowScale = object.newScale;
			$scope.$digest();
		};
		
		initialize();
		
	}
]);