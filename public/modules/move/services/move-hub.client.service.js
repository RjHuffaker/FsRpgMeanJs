'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('MoveHub', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'DeckUtils', 'StackUtils', 'switchHorizontal', 'switchVertical', 'stackOver', 'stackUnder', 'unstackCard', 'toggleOverlap',
	function($rootScope, CoreVars, Bakery, PanelUtils, DeckUtils, StackUtils, switchHorizontal, switchVertical, stackOver, stackUnder, unstackCard, toggleOverlap){
		
		var service = {};
		
		$rootScope.$on('CoreVars:getDeckWidth', DeckUtils.setDeckWidth(Bakery.resource.cardList));
		
		var getCardList = function(){
			return Bakery.resource.cardList;
		};
		
		service.triggerOverlap = function(panel){
			if(!CoreVars.cardMoved){
				var _deck = getCardList();
				toggleOverlap(_deck, panel);
			}
		};
		
		service.moveHorizontal = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = PanelUtils.getLowestPanel(_deck, panel.x_coord).index;
		//	if(panel.y_coord > 0 || (panel.y_coord === 0 && panel.stacked && !panel.y_overlap)){
		//		console.log('unstackCard');
		//		unstackCard(_deck, slot, panel);
		//	} else if (panel.y_coord === 0){
				console.log('switchHorizontal');
				switchHorizontal(_deck, slot, panel);
		//	}
		};
		
		service.moveDiagonalUp = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = PanelUtils.getLowestPanel(_deck, panel.x_coord).index;
			if(panel.y_coord === 0){
				stackUnder(_deck, slot, panel);
			} else {
				unstackCard(_deck, slot, panel);
			}
		};
		
		service.moveDiagonalDown = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = PanelUtils.getLowestPanel(_deck, panel.x_coord).index;
			if(panel.y_coord === 0){
				stackOver(_deck, slot, panel);
			} else {
				unstackCard(_deck, slot, panel);
			}
		};
		
		service.moveVertical = function(slot, panel){
			var _deck = getCardList();
			switchVertical(_deck, slot, panel);
		};
		
		service.unstackLeft = function(panel){
			if(panel.y_coord > 0){
				var _deck = getCardList();
				var unstack_coord = -CoreVars.x_dim_em;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		service.unstackRight = function(panel){
			if(panel.y_coord > 0){
				var _deck = getCardList();
				var _last = PanelUtils.getLastPanel(_deck);
				var unstack_coord = _last.panel.x_coord + CoreVars.x_dim_em;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		return service;
	}]);
