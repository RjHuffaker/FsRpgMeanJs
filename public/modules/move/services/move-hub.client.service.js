'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('MoveHub', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'DeckUtils', 'switchHorizontal', 'switchVertical', 'stackOver', 'stackUnder', 'unstackCard', 'toggleOverlap',
	function($rootScope, CoreVars, Bakery, PanelUtils, DeckUtils, switchHorizontal, switchVertical, stackOver, stackUnder, unstackCard, toggleOverlap){
		
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
			if(panel.above.adjacent){
				unstackCard(_deck, slot, panel);
			} else {
				switchHorizontal(_deck, slot, panel);
			}
		};
		
		service.moveDiagonalUp = function(slot, panel){
			var _deck = getCardList();
			console.log('moveDiagonalUp');
			if(PanelUtils.isInCluster(_deck, panel._id)){
				switchHorizontal(_deck, slot, panel);
			} else {
				if(panel.above.overlap){
					unstackCard(_deck, slot, panel);
				} else {
					stackUnder(_deck, slot, panel);
				}
			}
		};
		
		service.moveDiagonalDown = function(slot, panel){
			var _deck = getCardList();
			console.log('moveDiagonalDown');
			if(PanelUtils.isInCluster(_deck, panel._id)){
				switchHorizontal(_deck, slot, panel);
			} else {
				if(panel.above.adjacent){
					unstackCard(_deck, slot, panel);
				} else {
					stackOver(_deck, slot, panel);
				}
			}
		};
		
		service.moveVertical = function(slot, panel){
			var _deck = getCardList();
			switchVertical(_deck, slot, panel);
		};
		
		service.unstackLeft = function(panel){
			if(panel.y_coord > 0){
				console.log('unstackLeft');
				var _deck = getCardList();
				var unstack_coord = -CoreVars.x_dim_em;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		service.unstackRight = function(panel){
			if(panel.y_coord > 0){
				console.log('unstackRight');
				var _deck = getCardList();
				var _last = PanelUtils.getLast(_deck);
				var unstack_coord = _last.panel.x_coord + CoreVars.x_dim_em;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		return service;
	}]);
