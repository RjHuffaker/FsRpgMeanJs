'use strict';

// Cards controller
angular.module('cards').controller('CardsCtrl', ['$scope', '$location', '$log', 'Cards', 'CardsDeck',
	function($scope, $location, $log, Cards, CardsDeck) {
		
		$scope.cards = Cards;
		
		$scope.cardsDeck = CardsDeck;
		
		$scope.newCard = function(){
			Cards.addCard();
			Cards.cardNew = true;
			Cards.cardSaved = false;
		};
		
		$scope.openCard = function(card){
			$location.path('cards/'+card._id+'/edit');
			Cards.cardNew = false;
			Cards.cardSaved = false;
		};
		
		$scope.saveCard = function(){
			Cards.editCard();
			Cards.cardNew = false;
			Cards.cardSaved = true;
		};
		
		$scope.exitCard = function(){
			if(Cards.cardNew){
				Cards.deleteCard();
			}
			$location.path('cards');
		};
		
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