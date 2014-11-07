'use strict';

var coreModule = angular.module('core');

// Core Controller
coreModule.controller('HomeController', ['$scope', 'Authentication', 'CardService', 
	function($scope, Authentication, CardService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		// Link to data service
		$scope.CardSRVC = CardService;
		
		var onCardMoved = function(event, object){
			var oldIndex = object.oldIndex;
			var newIndex = object.newIndex;
			moveCard(object.oldIndex, object.newIndex);
		};
		
		function moveCard(indexA, indexB){
			var index_a = $scope.CardSRVC.cardList[indexA].index;
			var index_b = $scope.CardSRVC.cardList[indexB].index;
			$scope.CardSRVC.cardList[indexA].index = index_b;
			$scope.CardSRVC.cardList[indexB].index = index_a;
			$scope.CardSRVC.cardList.sort(function(a, b){
				return a.index - b.index;
			});
		}
		
		$scope.$on('cardDeck:onCardMoved', onCardMoved);
		
	}
]);