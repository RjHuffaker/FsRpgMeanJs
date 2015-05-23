'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('CoreMove', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack', 'switchHorizontal', 'switchVertical', 'stackOver', 'stackUnder', 'unstackCard', 'toggleOverlap',
	function($rootScope, CoreVars, Bakery, CorePanel, CoreStack, switchHorizontal, switchVertical, stackOver, stackUnder, unstackCard, toggleOverlap){
		
		var service = {};
		
		service.windowHeight = 0;
		
		var getCardList = function(){
			return Bakery.resource.cardList;
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$rootScope.$on('screenSize:onHeightChange', onHeightChange);
			
			$rootScope.$on('corePanel:onPressCard', onPressCard);
			$rootScope.$on('corePanel:onReleaseCard', onReleaseCard);
		};
		
		var onHeightChange = function(event, object){
			service.windowHeight = object.newHeight;
		};
		
		// Reset move variables
		var onPressCard = function(event, object){
			var _deck = getCardList();
			var panel = object.panel;
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = CorePanel.getPanel(_deck, panel_x, panel_y).index;
			
			CoreVars.cardMoved = false;
			if(_deck[panel_index].y_overlap){
				for(var ia = 0; ia < _deck.length; ia++){
					if(_deck[ia].x_coord === panel_x && _deck[ia].y_coord >= panel_y){
						_deck[ia].dragging = true;
					}
				}
			} else {
				_deck[panel_index].dragging = true;
			}
			
			$rootScope.$digest();
		};
		
		// Reset move variables
		var onReleaseCard = function(event, object){
			var _deck = getCardList();
			var panel = object.panel;
			var panel_index = CorePanel.getPanel(_deck, panel.x_coord, panel.y_coord).index;
			
			CoreVars.cardMoved = false;
			for(var ia = 0; ia < _deck.length; ia++){
				_deck[ia].dragging = false;
			}
			
			$rootScope.$digest();
		};
		
		service.triggerOverlap = function(panel){
			if(!CoreVars.cardMoved){
				var _deck = getCardList();
				toggleOverlap(_deck, panel);
			}
		};
		
		service.moveHorizontal = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = CoreStack.getLowestPanel(_deck, panel.x_coord).index;
			if(panel.y_coord > 0 || (panel.y_coord === 0 && panel.stacked && !panel.y_overlap)){
				console.log('unstackCard');
				unstackCard(_deck, slot, panel);
			} else if (panel.y_coord === 0){
				console.log('switchHorizontal');
				switchHorizontal(_deck, slot, panel);
			}
		};

		service.moveDiagonalUp = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = CoreStack.getLowestPanel(_deck, panel.x_coord).index;
			if(panel.y_coord === 0){
				stackUnder(_deck, slot, panel);
			} else {
				unstackCard(_deck, slot, panel);
			}
		};

		service.moveDiagonalDown = function(slot, panel){
			var _deck = getCardList();
			var _lowest_index = CoreStack.getLowestPanel(_deck, panel.x_coord).index;
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
				var unstack_coord = CorePanel.getPanel(_deck, 0, 0).panel.x_coord - CoreVars.x_dim;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		service.unstackRight = function(panel){
			if(panel.y_coord > 0){
				var _deck = getCardList();
				var _last = CoreStack.getLastPanel(_deck);
				var unstack_coord = _last.panel.x_coord + CoreVars.x_dim;
				unstackCard(_deck, {x_coord: unstack_coord}, panel);
			}
		};
		
		initialize();
		
		return service;
	}]);
