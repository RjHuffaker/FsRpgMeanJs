

// Factory-service for managing stuff
angular.module('core').factory('CardService', [
	function($rootScope){
		'use strict';
		var service = {};
		
		service.cardList = {
			card_a: { index: 0, name: 'Card A', column: 0, overlap: false },
			card_b: { index: 1, name: 'Card B', column: 250, overlap: false },
			card_c: { index: 2, name: 'Card C', column: 500, overlap: false },
			card_d: { index: 3, name: 'Card D', column: 750, overlap: false },
			card_e: { index: 4, name: 'Card E', column: 1000, overlap: false },
			card_f: { index: 5, name: 'Card F', column: 1250, overlap: false }
		};
		
		function cardByIndex(index){
			for(var key in service.cardList){
				var card = service.cardList[key];
				if(card.index === index){
					console.log('key: '+key);
					return key;
				}
			}
		}
		
		service.cardListLength = function(){
			var length = 0, key;
			for (key in service.cardList) {
				if (service.cardList.hasOwnProperty(key)) length++;
			}
			return length;
		};
		
		service.shiftLeft = function(index){
			if(index > 0){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index-1);
				
				if(service.cardList[_old].overlap){
					service.cardList[_new].column += 25;
				} else {
					service.cardList[_new].column += 250;
				}
				
				if(service.cardList[_new].overlap){
					service.cardList[_old].column -= 25;
				} else {
					service.cardList[_old].column -= 250;
				}
				service.cardList[_old].index = index-1;
				service.cardList[_new].index = index;
				
			}
			if(service.cardList[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.shiftRight = function(index){
			if(index < service.cardListLength() - 1){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index+1);
				
				if(service.cardList[_old].overlap){
					service.cardList[_new].column -= 25;
				} else {
					service.cardList[_new].column -= 250;
				}
				
				if(service.cardList[_new].overlap){
					service.cardList[_old].column += 25;
				} else {
					service.cardList[_old].column += 250;
				}
				service.cardList[_old].index = index+1;
				service.cardList[_new].index = index;
			}
			if(service.cardList[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.toggleOverlap = function(index){
			var _card = cardByIndex(index);
			if(service.cardList[_card].overlap){
				
				for(var key1 in service.cardList){
					if(service.cardList[key1].index > index-1){
						service.cardList[key1].column += 225;
					}
				}
				
				service.cardList[_card].overlap = false;
			} else {
				
				for(var key2 in service.cardList){
					if(service.cardList[key2].index > index-1){
						service.cardList[key2].column -= 225;
					}
				}
				
				service.cardList[_card].overlap = true;
			}
		};
		
		return service;
	}]);