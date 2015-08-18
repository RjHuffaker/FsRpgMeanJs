'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('MoveHub', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'DeckUtils', 'switchHorizontal', 'switchVertical', 'moveHigher', 'moveLower', 'stackHigher', 'stackLower', 'unstackCard', 'toggleOverlap',
	function($rootScope, CoreVars, Bakery, PanelUtils, DeckUtils, switchHorizontal, switchVertical, moveHigher, moveLower, stackHigher, stackLower, unstackCard, toggleOverlap){
		
		var service = {};
		
		$rootScope.$on('CoreVars:getDeckWidth', DeckUtils.setDeckWidth(Bakery.resource.cardList));
		
		var getCardList = function(){
			return Bakery.resource.cardList;
		};
		
		service.triggerOverlap = function(panel, nearest){
			if(!CoreVars.cardMoved){
				var _cardList = getCardList();
				toggleOverlap(_cardList, panel._id, nearest);
			}
		};
		
		service.moveHorizontal = function(slot, panel){
			var _deck = getCardList();
			console.log('moveHorizontal');
			// if(panel.above.adjacent){
			// 	unstackCard(_deck, slot, panel);
			// } else {
				switchHorizontal(_deck, slot, panel);
			// }
		};
		
		service.moveVertical = function(slot, panel){
			var _deck = getCardList();
			unstackCard(_deck, slot, panel);
		};
		
		service.unstackLeft = function(panel){
			if(panel.y_coord > 0){
				console.log('unstackLeft');
				var _deck = getCardList();
				var _first = PanelUtils.getFirst(_deck);
				unstackCard(_deck, _first, panel);
			}
		};
		
		service.unstackRight = function(panel){
			if(panel.y_coord > 0){
				console.log('unstackRight');
				var _deck = getCardList();
				var _last = PanelUtils.getLast(_deck);
				unstackCard(_deck, _last, panel);
			}
		};
		
		service.stackHigher = function(slot, panel){
			console.log('stackHigher');
			var _deck = getCardList();
			stackHigher(_deck, slot, panel);
		};
		
		service.stackLower = function(slot, panel){
			console.log('stackLower');
			var _deck = getCardList();
			stackLower(_deck, slot, panel);
		};
		
		service.moveHigher = function(slot, panel){
			console.log('moveHigher');
			var _deck = getCardList();
			moveHigher(_deck, slot, panel);
		};
		
		service.moveLower = function(slot, panel){
			console.log('moveLower');
			var _deck = getCardList();
			moveLower(_deck, slot, panel);
		};
		
		return service;
	}]);
