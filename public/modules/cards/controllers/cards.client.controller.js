'use strict';

var cardsModule = angular.module('cards');

// Cards controller
cardsModule.controller('CardsCtrl', ['$scope', '$location', '$log', 'DataSRVC', 'CardDeck', 'Cards',
	function($scope, $location, $log, DataSRVC, CardDeck, Cards) {
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.cards = Cards;
		
		$scope.windowHeight = 0;
		
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
			$scope.$digest();
		};
		
		initialize();
	}
]);