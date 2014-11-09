

// Factory-service for managing stuff
angular.module('core').factory('CardService', [
	function($http, $rootScope){
		'use strict';
		var service = {};
		
		service.cardList = [
			{ index: 0, name: 'Card A', column: 0, overlap: false },
			{ index: 1, name: 'Card B', column: 250, overlap: false },
			{ index: 2, name: 'Card C', column: 500, overlap: false },
			{ index: 3, name: 'Card D', column: 750, overlap: false },
			{ index: 4, name: 'Card E', column: 1000, overlap: false },
			{ index: 5, name: 'Card F', column: 1250, overlap: false }
		];
		
		function cardByIndex(index){
			for(var i = 0, l = service.cardList.length; i < l; i++) {
				if(service.cardList[i].index === index) {
					return i;
				}
			}
		}
		
		service.shiftLeft = function(index){
			if(index > 0){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index-1);
				
				if(service.cardList[_old].overlap){
			//		service.toggleOverlap(index);
				}
				
				console.log('shiftLeft: '+_old+' to '+_new);
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
			if(index < service.cardList.length - 1){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index+1);
				
				if(service.cardList[_old].overlap){
			//		service.toggleOverlap(index);
				}
				
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
				for(var i = 0, l = service.cardList.length; i < l; i++) {
					if(service.cardList[i].index > index-1){
						service.cardList[i].column += 225;
					}
				}
				service.cardList[_card].overlap = false;
			} else {
				for(var i = 0, l = service.cardList.length; i < l; i++) {
					if(service.cardList[i].index > index-1){
						service.cardList[i].column -= 225;
					}
				}
				service.cardList[_card].overlap = true;
			}
		};
		
		
		
		
		
		return service;
	}]);