'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$location', '$log', 'Cards', 'CardsDeck',
	function($scope, $location, $log, Cards, CardsDeck) {
		
		this.cards = Cards;
		
		this.cardsDeck = CardsDeck;
		
		this.newCard = function(){
			Cards.addCard();
			Cards.cardNew = true;
			Cards.cardSaved = false;
		};
		
		this.openCard = function(card){
			$location.path('cards/'+card._id+'/edit');
			Cards.cardNew = false;
			Cards.cardSaved = false;
		};
		
		this.saveCard = function(){
			Cards.editCard();
			Cards.cardNew = false;
			Cards.cardSaved = true;
		};
		
		this.exitCard = function(){
			if(Cards.cardNew){
				Cards.deleteCard();
			}
			$location.path('cards');
		};
		
		var shiftLeft = function(event, object){
			CardsDeck.shiftLeft(object.index);
		};
		
		var shiftRight = function(event, object){
			CardsDeck.shiftRight(object.index);
		};
		
		var toggleOverlap = function(event, object){
			var _card = object.index;
			if(_card > 0){
				CardsDeck.toggleOverlap(object.index);
			}
		};
		
		$scope.$on('cardDeck:shiftLeft', shiftLeft);
		$scope.$on('cardDeck:shiftRight', shiftRight);
		$scope.$on('cardDeck:toggleOverlap', toggleOverlap);
		
	}
]);