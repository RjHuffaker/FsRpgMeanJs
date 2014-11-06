'use strict';

var coreModule = angular.module('core');

// Core Controller
coreModule.controller('HomeController', ['$scope', 'Authentication', 'CardService', 
	function($scope, Authentication, CardService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		// Link to data service
		$scope.CardSRVC = CardService;
		
		$scope.onDragComplete = function(index, card, event){
			console.log('onDragComplete');
		};
		
		$scope.onDragging = function(index, card, event){
			console.log('onDragging');
		};
		
		$scope.onDropComplete = function(index, card, event){
			var oldIndex = $scope.CardSRVC.cardList.indexOf(card);
		};
		
		$scope.onDragOver = function(index, card, event){
			var oldIndex = $scope.CardSRVC.cardList.indexOf(card);
			moveCard(index, oldIndex);
		};
		
		var onCardMoved = function(event, object){
			var oldIndex = object.oldIndex;
			var newIndex = object.newIndex;
			console.log('onCardMoved: '+oldIndex+' to '+newIndex);
			moveCard(object.oldIndex, object.newIndex);
		};
		
		function moveCard(indexA, indexB){
			console.log('movecard: '+indexA+' to '+indexB);
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