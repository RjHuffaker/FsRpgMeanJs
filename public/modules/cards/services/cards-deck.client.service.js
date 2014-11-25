'use strict';
var cardsModule = angular.module('cards');

// Factory-service for managing PC card deck.
cardsModule.factory('CardsDeck', ['Cards',
	function(Cards){
		var service = {};
		
		function cardByIndex(index){
			for(var i = 0; i < Cards.cardList.length; i++){
				var card = Cards.cardList[i];
				if(card.index === index){
					return i;
				}
			}
		}
		
		service.shiftLeft = function(index){
			if(index > 0){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index-1);
				
				if(Cards.cardList[_old].overlap){
					Cards.cardList[_new].column += 25;
				} else {
					Cards.cardList[_new].column += 250;
				}
				
				if(Cards.cardList[_new].overlap){
					Cards.cardList[_old].column -= 25;
				} else {
					Cards.cardList[_old].column -= 250;
				}
				Cards.cardList[_old].index = index-1;
				Cards.cardList[_new].index = index;
				
			}
			if(Cards.cardList[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.shiftRight = function(index){
			if(index < Cards.cardList.length - 1){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index+1);
				
				if(Cards.cardList[_old].overlap){
					Cards.cardList[_new].column -= 25;
				} else {
					Cards.cardList[_new].column -= 250;
				}
				
				if(Cards.cardList[_new].overlap){
					Cards.cardList[_old].column += 25;
				} else {
					Cards.cardList[_old].column += 250;
				}
				Cards.cardList[_old].index = index+1;
				Cards.cardList[_new].index = index;
			}
			if(Cards.cardList[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.toggleOverlap = function(index){
			var _card = cardByIndex(index);
			if(Cards.cardList[_card].overlap){
				for(var index1 = 0; index1 < Cards.cardList.length; index1++){
					if(Cards.cardList[index1].index > index-1){
						Cards.cardList[index1].column += 225;
					}
				}
				Cards.cardList[_card].overlap = false;
			} else {
				for(var index2 = 0; index2 < Cards.cardList.length; index2++){
					if(Cards.cardList[index2].index > index-1){
						Cards.cardList[index2].column -= 225;
					}
				}
				Cards.cardList[_card].overlap = true;
			}
		};
		
		return service;
	}]);