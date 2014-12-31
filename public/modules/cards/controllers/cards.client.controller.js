'use strict';

// Cards controller
angular.module('cards').controller('CardsCtrl', ['$scope', '$location', '$log', 'DataSRVC', 'Cards', 'CardsDeck',
	function($scope, $location, $log, DataSRVC, Cards, CardsDeck) {
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.cards = Cards;
		
		$scope.cardsDeck = CardsDeck;
		
		var moveHorizontal = function(event, object){
			console.log('moveHorizontal');
		};

		var moveDiagonalUp = function(event, object){
			console.log('moveDiagonalUp');
		};

		var moveDiagonalDown = function(event, object){
			console.log('moveDiagonalDown');
		};
		
		var moveVertical = function(event, object){
			console.log('moveVertical');
		};
		
		var unstackLeft = function(event, object){
			console.log('unstackLeft');
		};
		
		var unstackRight = function(event, object){
			console.log('unstackRight');
		};
		
		var toggleOverlap = function(event, object){
			console.log('toggleOverlap');
		};
		
		var onReleaseCard = function(){
			console.log('onReleaseCard');
		};
		
		$scope.$on('cardSlot:moveHorizontal', moveHorizontal);
		$scope.$on('cardSlot:moveDiagonalUp', moveDiagonalUp);
		$scope.$on('cardSlot:moveDiagonalDown', moveDiagonalDown);
		$scope.$on('cardSlot:moveVertical', moveVertical);
		
		$scope.$on('cardDeck:unstackLeft', unstackLeft);
		$scope.$on('cardDeck:unstackRight', unstackRight);
		$scope.$on('cardPanel:toggleOverlap', toggleOverlap);
		$scope.$on('cardPanel:onReleaseCard', onReleaseCard);
		
	}
]);