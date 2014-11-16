'use strict';
var pcsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
pcsModule.factory('PcsDeckSRVC', ['PcsBreadSRVC',
	function(PcsBreadSRVC){
		var service = {};
		
		function cardByIndex(index){
			for(var key in PcsBreadSRVC.pc.cards){
				var card = PcsBreadSRVC.pc.cards[key];
				if(card.index === index){
					console.log('key: '+key);
					return key;
				}
			}
		}
		
		service.cardsTotal = function(){
			var length = 0, key;
			for (key in PcsBreadSRVC.pc.cards) {
				if (PcsBreadSRVC.pc.cards.hasOwnProperty(key)) length++;
			}
			return length;
		};
		
		service.shiftLeft = function(index){
			if(index > 0){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index-1);
				
				if(PcsBreadSRVC.pc.cards[_old].overlap){
					PcsBreadSRVC.pc.cards[_new].column += 25;
				} else {
					PcsBreadSRVC.pc.cards[_new].column += 250;
				}
				
				if(PcsBreadSRVC.pc.cards[_new].overlap){
					PcsBreadSRVC.pc.cards[_old].column -= 25;
				} else {
					PcsBreadSRVC.pc.cards[_old].column -= 250;
				}
				PcsBreadSRVC.pc.cards[_old].index = index-1;
				PcsBreadSRVC.pc.cards[_new].index = index;
				
			}
			if(PcsBreadSRVC.pc.cards[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.shiftRight = function(index){
			if(index < service.cardsTotal() - 1){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index+1);
				
				if(PcsBreadSRVC.pc.cards[_old].overlap){
					PcsBreadSRVC.pc.cards[_new].column -= 25;
				} else {
					PcsBreadSRVC.pc.cards[_new].column -= 250;
				}
				
				if(PcsBreadSRVC.pc.cards[_new].overlap){
					PcsBreadSRVC.pc.cards[_old].column += 25;
				} else {
					PcsBreadSRVC.pc.cards[_old].column += 250;
				}
				PcsBreadSRVC.pc.cards[_old].index = index+1;
				PcsBreadSRVC.pc.cards[_new].index = index;
			}
			if(PcsBreadSRVC.pc.cards[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.toggleOverlap = function(index){
			var _card = cardByIndex(index);
			if(PcsBreadSRVC.pc.cards[_card].overlap){
				
				for(var key1 in PcsBreadSRVC.pc.cards){
					if(PcsBreadSRVC.pc.cards[key1].index > index-1){
						PcsBreadSRVC.pc.cards[key1].column += 225;
					}
				}
				
				PcsBreadSRVC.pc.cards[_card].overlap = false;
			} else {
				
				for(var key2 in PcsBreadSRVC.pc.cards){
					if(PcsBreadSRVC.pc.cards[key2].index > index-1){
						PcsBreadSRVC.pc.cards[key2].column -= 225;
					}
				}
				
				PcsBreadSRVC.pc.cards[_card].overlap = true;
			}
		};
		
		return service;
	}]);