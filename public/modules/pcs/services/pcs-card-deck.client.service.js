'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsCardDeck', ['Pcs',
	function(Pcs){
		var service = {};
		
		service.shiftUp = function(card){
			var x_index = card.x_index;
			var y_index = card.y_index;
			if(y_index > 0){
				var _card = Pcs.cardByIndex(card.x_index, card.y_index);
				Pcs.pc.cards[_card].y_coord -= 25;
			}
		};
		
		service.shiftDown = function(card){
			var x_index = card.x_index;
			var y_index = card.y_index;
			
			if(y_index < Pcs.pc.cards[Pcs.lowestCard(x_index)].y_index - 1){
				var _card = Pcs.cardByIndex(card.x_index, card.y_index);
				Pcs.pc.cards[_card].y_coord += 25;
			}
		};
		
		service.shiftLeft = function(card){
			var x_index = card.x_index;
			var y_index = card.y_index;
			if(x_index > 0){
				var _old = Pcs.cardByIndex(x_index, y_index);
				var _new = Pcs.cardByIndex(x_index-1, 0);
				
				if(Pcs.pc.cards[_old].x_overlap){
					Pcs.pc.cards[_new].x_coord += 25;
				} else {
					Pcs.pc.cards[_new].x_coord += 250;
				}
				
				if(Pcs.pc.cards[_new].x_overlap){
					Pcs.pc.cards[_old].x_coord -= 25;
				} else {
					Pcs.pc.cards[_old].x_coord -= 250;
				}
				Pcs.pc.cards[_old].x_index = x_index-1;
				Pcs.pc.cards[_new].x_index = x_index;
				
			}
			if(Pcs.pc.cards[Pcs.firstCard()].x_overlap){
				service.toggle_X_Overlap(Pcs.pc.cards[Pcs.firstCard()]);
			}
		};
		
		service.shiftRight = function(card){
			var x_index = card.x_index;
			var y_index = card.y_index;
			if(card.x_index < Pcs.pc.cards.length - 1){
				var _old = Pcs.cardByIndex(x_index, y_index);
				var _new = Pcs.cardByIndex(x_index+1, 0);
				
				if(Pcs.pc.cards[_old].x_overlap){
					Pcs.pc.cards[_new].x_coord -= 25;
				} else {
					Pcs.pc.cards[_new].x_coord -= 250;
				}
				
				if(Pcs.pc.cards[_new].x_overlap){
					Pcs.pc.cards[_old].x_coord += 25;
				} else {
					Pcs.pc.cards[_old].x_coord += 250;
				}
				Pcs.pc.cards[_old].x_index = x_index+1;
				Pcs.pc.cards[_new].x_index = x_index;
			}
			if(Pcs.pc.cards[Pcs.firstCard()].x_overlap){
				service.toggle_X_Overlap(Pcs.pc.cards[Pcs.firstCard()]);
			}
		};
		
		service.toggle_X_Overlap = function(card){
			var x_index = card.x_index;
			var y_index = card.y_index;
			var _card = Pcs.cardByIndex(x_index, y_index);
			if(Pcs.pc.cards[_card].x_overlap){
				for(var index1 = 0; index1 < Pcs.pc.cards.length; index1++){
					if(Pcs.pc.cards[index1].x_index > x_index-1){
						Pcs.pc.cards[index1].x_coord += 225;
					}
				}
				Pcs.pc.cards[_card].x_overlap = false;
			} else {
				for(var index2 = 0; index2 < Pcs.pc.cards.length; index2++){
					if(Pcs.pc.cards[index2].x_index > x_index-1){
						Pcs.pc.cards[index2].x_coord -= 225;
					}
				}
				Pcs.pc.cards[_card].x_overlap = true;
			}
		};
		
		service.toggle_Y_Overlap = function(card){
			var x_index = card.x_index;
			var y_index = card.y_index;
			var _card = Pcs.cardByIndex(x_index, y_index);
			
		};
		
		return service;
	}]);