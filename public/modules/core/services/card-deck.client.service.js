'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('pcsCardDeck', ['Pcs',
	function(Pcs){
		var service = {};
		
		function cardByIndex(index){
			for(var i = 0; i < Pcs.pc.cards.length; i++){
				var card = Pcs.pc.cards[i];
				if(card.index === index){
					return i;
				}
			}
		}
		
		service.shiftLeft = function(index){
			if(index > 0){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index-1);
				
				if(Pcs.pc.cards[_old].overlap){
					Pcs.pc.cards[_new].column += 25;
				} else {
					Pcs.pc.cards[_new].column += 250;
				}
				
				if(Pcs.pc.cards[_new].overlap){
					Pcs.pc.cards[_old].column -= 25;
				} else {
					Pcs.pc.cards[_old].column -= 250;
				}
				Pcs.pc.cards[_old].index = index-1;
				Pcs.pc.cards[_new].index = index;
				
			}
			if(Pcs.pc.cards[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.shiftRight = function(index){
			if(index < Pcs.pc.cards.length - 1){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index+1);
				
				if(Pcs.pc.cards[_old].overlap){
					Pcs.pc.cards[_new].column -= 25;
				} else {
					Pcs.pc.cards[_new].column -= 250;
				}
				
				if(Pcs.pc.cards[_new].overlap){
					Pcs.pc.cards[_old].column += 25;
				} else {
					Pcs.pc.cards[_old].column += 250;
				}
				Pcs.pc.cards[_old].index = index+1;
				Pcs.pc.cards[_new].index = index;
			}
			if(Pcs.pc.cards[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.toggleOverlap = function(index){
			var _card = cardByIndex(index);
			if(Pcs.pc.cards[_card].overlap){
				for(var index1 = 0; index1 < Pcs.pc.cards.length; index1++){
					if(Pcs.pc.cards[index1].index > index-1){
						Pcs.pc.cards[index1].column += 225;
					}
				}
				Pcs.pc.cards[_card].overlap = false;
			} else {
				for(var index2 = 0; index2 < Pcs.pc.cards.length; index2++){
					if(Pcs.pc.cards[index2].index > index-1){
						Pcs.pc.cards[index2].column -= 225;
					}
				}
				Pcs.pc.cards[_card].overlap = true;
			}
		};
		
		return service;
	}]);