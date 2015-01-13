'use strict';
var coreModule = angular.module('core');

// Factory-service for managing card-deck, card-slot and card-panel directives.
coreModule.factory('CardDeck', ['Cards', 'HomeDemo', 'Pcs', '$rootScope',
	function(Cards, HomeDemo, Pcs, $rootScope){
		var service = {};
		
		var x_dim = 10;
		var y_dim = 14;
		var x_tab = 2;
		var y_tab = 2;
		var x_cover = x_dim - x_tab;
		var y_cover = y_dim - y_tab;
		var _moveSpeed = 500;
		var cardMoved = false;
		var movingUp = false;
		var movingDown = false;
		var movingLeft = false;
		var movingRight = false;
		
		var cardList = function(deckType){
			if(deckType === 'pc'){
				return Pcs.pc.cards;
			} else if(deckType === 'card'){
				return Cards.cardList;
			} else if(deckType === 'home'){
				return HomeDemo.cards;
			}
		};
		
		var cardByCoord = function(cardType, x_coord, y_coord){
			var _deck = cardList(cardType);
			var _card = {};
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord === x_coord && _deck[i].y_coord === y_coord){
					return i;
				}
			}
		};
		
		var firstCard = function(cardType){
			return cardByCoord(0, 0);
		};
		
		var lastCard = function(cardType){
			var _deck = cardList(cardType);
			var _card = {};
			var _last = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = _deck[i];
				}
			}
			return _last;
		};
		
		var lowestCard = function(cardType, x_coord) {
			var _deck = cardList(cardType);
			var _card = {};
			var _lowest = 0;
			for(var i = 0; i < _deck.length; i++) {
				if(_deck[i].x_coord === x_coord){
					if(_deck[i].y_coord > (_card.y_coord || -1)){
						_lowest = i;
						_card = _deck[i];
					}
				}
			}
			return _lowest;
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$rootScope.$on('$destroy', onDestroy);
			$rootScope.$on('cardPanel:onPressCard', onPressCard);
			$rootScope.$on('cardPanel:onReleaseCard', onReleaseCard);
			$rootScope.$on('cardPanel:toggleOverlap', toggleOverlap);
			$rootScope.$on('cardSlot:moveHorizontal', moveHorizontal);
			
			$rootScope.$on('cardSlot:moveDiagonalUp', moveDiagonalUp);
			$rootScope.$on('cardSlot:moveDiagonalDown', moveDiagonalDown);
			$rootScope.$on('cardSlot:moveVertical', moveVertical);
			
			$rootScope.$on('cardDeck:unstackLeft', unstackLeft);
			$rootScope.$on('cardDeck:unstackRight', unstackRight);
		};
		
		var onDestroy = function(){
			toggleListeners(false);
		};
		
		// Set move booleans
		var setMovingUp = function(interval){
			movingUp = true;
			cardMoved = true;
			setTimeout(
				function () {
					movingUp = false;
				},
			interval);
		};
		
		var setMovingDown = function(interval){
			movingDown = true;
			cardMoved = true;
			setTimeout(
				function(){
					movingDown = false;
				},
			interval);
		};
		
		var setMovingLeft = function(interval){
			movingLeft = true;
			cardMoved = true;
			setTimeout(
				function(){
					movingLeft = false;
				},
			interval);
		};
		
		var setMovingRight = function(interval){
			movingRight = true;
			cardMoved = true;
			setTimeout(
				function(){
					movingRight = false;
				},
			interval);
		};
		
		// Set state variables
		var onPressCard = function(event, object){
			var _panel = object.panel;
			var _deck = cardList(_panel.deckType);
			for(var ia = 0; ia < _deck.length; ia++){
				if(_deck[ia].x_coord === _panel.x_coord){
					if(_deck[ia].y_coord === _panel.y_coord && !_panel.y_overlap){
						_deck[ia].dragging = true;
						_deck[ia].stacked = false;
					} else if(_deck[ia].y_coord >= _panel.y_coord && _panel.y_overlap){
						_deck[ia].dragging = true;
						_deck[ia].stacked = true;
					}
				}
			}
			$rootScope.$apply();
		};
		
		// Reset move variables
		var onReleaseCard = function(event, object){
			cardMoved = false;
			movingUp = false;
			movingDown = false;
			movingLeft = false;
			movingRight = false;
			
			var _deck = cardList(object.panel.deckType);
			for(var ia = 0; ia < _deck.length; ia++){
				_deck[ia].dragging = false;
			}
			$rootScope.$apply();
		};
		
		var moveHorizontal = function(event, object){
			console.log('move horizontal');
			var _slot = object.slot;
			var _panel = object.panel;
			var _deckType = _panel.deckType;
			var _deck = cardList(_deckType);
			var _lowest_index = lowestCard(_deckType, _panel.x_coord);
			if((_panel.y_coord === 0 && _panel.y_overlap) || _deck[_lowest_index].y_coord === 0){
				switchHorizontal(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};

		var moveDiagonalUp = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deckType = _slot.deckType;
			var _deck = cardList(_deckType);
			var _lowest_index = lowestCard(_deckType, _panel.x_coord);
			if((_panel.y_coord === 0 && _panel.y_overlap) || _deck[_lowest_index].y_coord === 0){
				stackUnder(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};

		var moveDiagonalDown = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deckType = _slot.deckType;
			var _deck = cardList(_deckType);
			var _lowest_index = lowestCard(_deckType, _panel.x_coord);
			if((_panel.y_coord === 0 && _panel.y_overlap) || _deck[_lowest_index].y_coord === 0){
				stackOver(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};
		
		var moveVertical = function(event, object){
			switchVertical(object.slot, object.panel);
		};
		
		var unstackLeft = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deckType = _panel.deckType;
				var _deck = cardList(_deckType);
				var unstack_coord = _deck[lastCard(_deckType)].x_coord - x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		var unstackRight = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deckType = _panel.deckType;
				var _deck = cardList(_deckType);
				var unstack_coord = _deck[lastCard(_deckType)].x_coord + x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		// Swap card order along horizontal axis
		var switchHorizontal = function(slot, panel){
			console.log('switch horizontal');
			var _deckType = panel.deckType;
			var _deck = cardList(_deckType);
			
			var slot_x_coord = slot.x_coord;
			var slot_y_coord = slot.y_coord;
			var slot_x_overlap = slot.x_overlap;
			
			var panel_x_coord = panel.x_coord;
			var panel_y_coord = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			
			if(slot_y_coord === 0 && panel_y_coord === 0){
				if(panel_x_coord - slot_x_coord > 0 && !movingRight){
				// PANEL MOVING LEFT
					setMovingLeft(_moveSpeed);
					for(var ia = 0; ia < _deck.length; ia++){
						if(_deck[ia].x_coord === slot_x_coord){
						// Modify position of each card in "SLOT" column
							if(slot_x_coord > 0){
								if(panel_x_overlap){
									_deck[ia].x_coord += x_tab;
								} else {
									_deck[ia].x_coord += x_dim;
								}
							} else {
								_deck[ia].x_coord = x_dim;
								_deck[ia].x_overlap = false;
							}
						} else if(_deck[ia].x_coord === panel_x_coord){
						// Modify position of each card in "PANEL" column
							if(slot_x_coord > 0){
								if(slot_x_overlap){
									_deck[ia].x_coord -= x_tab;
								} else {
									_deck[ia].x_coord -= x_dim;
								}
							} else {
								_deck[ia].x_coord = 0;
								_deck[ia].x_overlap = false;
							}
						} else if(slot_x_coord === 0 && panel_x_overlap){
							_deck[ia].x_coord += x_cover;
						}
					}
				} else if(panel_x_coord - slot_x_coord < 0 && !movingLeft){
				// PANEL MOVING RIGHT
					setMovingRight(_moveSpeed);
					for(var ib = 0; ib < _deck.length; ib++){
						if(_deck[ib].x_coord === slot_x_coord){
						// Modify position of each card in "SLOT" column
							if(panel_x_coord > 0){
								if(panel_x_overlap){
									_deck[ib].x_coord -= x_tab;
								} else {
									_deck[ib].x_coord -= x_dim;
								}
							} else {
								_deck[ib].x_coord = 0;
								_deck[ib].x_overlap = false;
							}
						} else if(_deck[ib].x_coord === panel_x_coord){
						// Modify position of each card in "PANEL" column
							if(panel_x_coord > 0){
								if(slot_x_overlap){
									_deck[ib].x_coord += x_tab;
								} else {
									_deck[ib].x_coord += x_dim;
								}
							} else {
								_deck[ib].x_coord = x_dim;
								_deck[ib].x_overlap = false;
							}
						} else if(panel_x_coord === 0 && slot_x_overlap){
							_deck[ib].x_coord += x_cover;
						}
					}
				}
			}
		};
		
		// Swap card order along vertical axis
		var switchVertical = function(slot, panel){
			var _deckType = slot.deckType;
			var _deck = cardList(_deckType);
			
			var slot_index = cardByCoord(_deckType, slot.x_coord, slot.y_coord);
			var slot_x_coord = slot.x_coord;
			var slot_y_coord = slot.y_coord;
			var slot_y_overlap = slot.y_overlap;
			
			var panel_index = cardByCoord(_deckType, panel.x_coord, panel.y_coord);
			var panel_x_coord = panel.x_coord;
			var panel_y_coord = panel.y_coord;
			var panel_y_overlap = panel.y_overlap;
			
			if(panel_y_coord - slot_y_coord > 0 && !movingDown){
			// PANEL MOVING UP
				setMovingUp(_moveSpeed);
				
				_deck[slot_index].y_coord = panel_y_coord;
				_deck[panel_index].y_coord = slot_y_coord;
			} else if(panel_y_coord - slot_y_coord < 0 && !movingUp){
			// PANEL MOVING DOWN
				setMovingDown(_moveSpeed);
				
				_deck[slot_index].y_coord = panel_y_coord;
				_deck[panel_index].y_coord = slot_y_coord;
			}
			for(var ia = 0; ia < _deck.length; ia++){
				if(_deck[ia].x_coord === slot_x_coord){
					if(_deck[ia].y_coord !== slot_y_coord && !_deck[ia].y_overlap){
						if(_deck[ia].y_coord !== _deck[lowestCard(_deckType, slot_x_coord)].y_coord){
							toggle_Y_Overlap();
						}
					}
				}
			}
		};
		
		var stackOver = function(slot, panel){
			var _deckType = slot.deckType;
			var _deck = cardList(_deckType);
			
			var slot_index = cardByCoord(_deckType, slot.x_coord, slot.y_coord);
			var panel_index = cardByCoord(_deckType, panel.x_coord, panel.y_coord);
			
			var slot_x_coord = slot.x_coord;
			var slot_y_coord = slot.y_coord;
			var slot_x_overlap = slot.x_overlap;
			var slot_y_overlap = slot.y_overlap;
			var slot_lowest_coord = _deck[lowestCard(_deckType, slot_x_coord)].y_coord;
			
			var panel_x_coord = panel.x_coord;
			var panel_y_coord = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_lowest_coord = _deck[lowestCard(_deckType, panel_x_coord)].y_coord;
			
			if(panel_x_coord - slot_x_coord > 0 && !movingLeft){
			// CARD STACKING FROM RIGHT
				setMovingRight(_moveSpeed);
				_deck[slot_index].y_overlap = true;
				_deck[slot_index].stacked = true;
				_deck[panel_index].stacked = true;
				_deck[lowestCard(_deckType, panel_x_coord)].y_overlap = slot_y_overlap;
				for(var ia = 0; ia < _deck.length; ia++){
					if(_deck[ia].x_coord === panel_x_coord){
						_deck[ia].y_coord += slot_y_coord + y_tab;
					}
					if(_deck[ia].x_coord === slot_x_coord && _deck[ia].y_coord > slot_y_coord){
						_deck[ia].y_coord += panel_lowest_coord + y_tab;
					}
					if(_deck[ia].x_coord > slot_x_coord){
						_deck[ia].x_coord -= x_dim;
					}
				}
				
			} else if(panel_x_coord - slot_x_coord < 0 && !movingRight){
			// CARD STACKING FROM LEFT
				setMovingLeft(_moveSpeed);
				_deck[slot_index].y_overlap = true;
				_deck[slot_index].stacked = true;
				_deck[panel_index].stacked = true;
				_deck[lowestCard(_deckType, panel_x_coord)].y_overlap = slot_y_overlap;
				for(var ib = 0; ib < _deck.length; ib++){
					if(_deck[ib].x_coord === panel_x_coord){
						_deck[ib].y_coord += slot_y_coord + y_tab;
					}
					if(_deck[ib].x_coord > panel_x_coord){
						_deck[ib].x_coord -= x_dim;
						if(_deck[ib].x_coord === panel_x_coord && _deck[ib].y_coord > slot_y_coord){
							_deck[ib].y_coord += panel_lowest_coord + y_tab;
						}
					}
				}
			}
		};
		
		
		// Stack one card behind another and reposition deck to fill the gap
		var stackUnder = function(slot, panel){
			var _deckType = slot.deckType;
			var _deck = cardList(_deckType);
			var panel_index = cardByCoord(_deckType, panel.x_coord, panel.y_coord);
			var slot_index = cardByCoord(_deckType, slot.x_coord, slot.y_coord);
			
			var panel_x_coord = panel.x_coord;
			var panel_y_coord = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_lowest_coord = _deck[lowestCard(_deckType, panel_x_coord)].y_coord;
			
			var slot_x_coord = slot.x_coord;
			var slot_y_coord = slot.y_coord;
			var slot_lowest_coord = _deck[lowestCard(_deckType, slot_x_coord)].y_coord;
			
			if(panel_x_coord - slot_x_coord > 0 && !movingRight){
			//Card is stacking under from left
				setMovingLeft(_moveSpeed);
				_deck[panel_index].y_overlap = true;
				_deck[slot_index].stacked = true;
				_deck[panel_index].stacked = true;
				for(var ia = 0; ia < _deck.length; ia++){
					if(_deck[ia].x_coord === slot_x_coord){
						_deck[ia].y_coord += panel_lowest_coord + y_tab;
					}
					if(_deck[ia].x_coord > slot_x_coord){
						_deck[ia].x_coord -= x_dim;
					}
				}
				
			} else if(panel_x_coord - slot_x_coord < 0 && !movingLeft){
			//Card is stacking under from right
				setMovingRight(_moveSpeed);
				_deck[panel_index].y_overlap = true;
				_deck[slot_index].stacked = true;
				_deck[panel_index].stacked = true;
				for(var ib = 0; ib < _deck.length; ib++){
					if(_deck[ib].x_coord === slot_x_coord){
						_deck[ib].y_coord += panel_lowest_coord + y_tab;
					}
					if(_deck[ib].x_coord > panel_x_coord){
						_deck[ib].x_coord -= x_dim;
					}
				}
			}
		};
		
		// Withdraw card from stack and reposition deck to make room
		var unstackCard = function(slot, panel){
			var _deckType = panel.deckType;
			var _deck = cardList(_deckType);
			
			if(_deck[lowestCard(_deckType, panel.x_coord)].y_coord > 0){
				var panel_index = cardByCoord(_deckType, panel.x_coord, panel.y_coord);
				
				var panel_x_coord = panel.x_coord;
				var panel_y_coord = panel.y_coord;
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				
				var slot_x_coord = slot.x_coord;
				
				if(panel_x_coord - slot_x_coord > 0  && !movingLeft){
				// Card is unstacking to the left
					setMovingRight(_moveSpeed);
					if(panel_y_overlap){
					// Unstack multiple cards to the left
						for(var ia = 0; ia < _deck.length; ia++){
							if(_deck[ia].x_coord > panel_x_coord){
								_deck[ia].x_coord += x_dim;
							}
							if(_deck[ia].x_coord === panel_x_coord){
								if(panel_y_overlap){
									if(_deck[ia].y_coord < panel_y_coord){
										_deck[ia].x_coord += x_dim;
									} else if(_deck[ia].y_coord >= panel_y_coord){
										_deck[ia].y_coord -= panel_y_coord;
									}
								}
							}
						}
					} else if(!panel_y_overlap){							// Unstack single card to the left
						for(var ib = 0; ib < _deck.length; ib++){
							if(_deck[ib].x_coord >= panel_x_coord){
								if(_deck[ib].x_coord === panel_x_coord && _deck[ib].y_coord > panel_y_coord){
									_deck[ib].y_coord -= y_dim;
								}
								if(ib !== panel_index){
									_deck[ib].x_coord += x_dim;
								}
							}
						}
						_deck[panel_index].y_coord = 0;
						_deck[panel_index].stacked = false;
					}
					_deck[lowestCard(_deckType, panel_x_coord + 1)].y_overlap = false;
					_deck[lowestCard(_deckType, panel_x_coord + 1)].stacked = false;
				} else if(panel_x_coord - slot_x_coord < 0 && !movingRight){
				//Card is unstacking to the right
					setMovingLeft(_moveSpeed);
					if(panel_y_overlap){
					// Unstack multiple cards to the right
						for(var ic = 0; ic < _deck.length; ic++){
							if(_deck[ic].x_coord > panel_x_coord){
								_deck[ic].x_coord += x_dim;
							}
							if(_deck[ic].x_coord === panel_x_coord){
								if(_deck[ic].y_coord >= panel_y_coord){
									_deck[ic].x_coord += x_dim;
									_deck[ic].y_coord -= panel_y_coord;
								}
							}
						}
					} else if(!panel_y_overlap){
					// Unstack single (un-overlapped) card to the right
						for(var id = 0; id < _deck.length; id++){
							if(_deck[id].x_coord > panel_x_coord){
								_deck[id].x_coord += x_dim;
							}
							if(_deck[id].x_coord === panel_x_coord && _deck[id].y_coord > panel_y_coord){
								_deck[id].y_coord -= y_dim;
							}
						}
						_deck[panel_index].x_coord += x_dim;
						_deck[panel_index].y_coord = 0;
					}
					_deck[lowestCard(_deckType, panel_x_coord)].y_overlap = false;
					_deck[lowestCard(_deckType, panel_x_coord)].stacked = false;
				}
			}
		};
		
		// Gatekeeper function for x_overlap and y_overlap
		var toggleOverlap = function(event, object){
			var _panel = object.panel;
			var _deckType = _panel.deckType;
			var _deck = cardList(_deckType);
			var _lowest = lowestCard(_deckType, _panel.x_coord);
			if(!cardMoved){
				if(_panel.x_coord > 0 && _deck[_lowest].y_coord === 0){
					toggle_X_Overlap(_panel);
				} else if(_panel.y_coord !== _deck[_lowest].y_coord){
					toggle_Y_Overlap(_panel);
				}
			}
		};
		
		var toggle_X_Overlap = function(panel){
			var _deckType = panel.deckType;
			var _deck = cardList(_deckType);
			var _index = cardByCoord(_deckType, panel.x_coord, panel.y_coord);
			
			if(panel.x_coord > 0){
				if(_deck[_index].x_overlap && !movingLeft){
				// Card overlapped
					setMovingRight(_moveSpeed);
					for(var ia = 0; ia < _deck.length; ia++){
						if(panel.x_coord <= _deck[ia].x_coord){
							_deck[ia].x_coord += x_cover;
						}
					}
					_deck[_index].x_overlap = false;
				} else if(!_deck[_index].x_overlap && !movingRight){
				// Card not overlapped
					setMovingLeft(_moveSpeed);
					for(var ib = 0; ib < _deck.length; ib++){
						if(panel.x_coord <= _deck[ib].x_coord){
							_deck[ib].x_coord -= x_cover;
						}
					}
					_deck[_index].x_overlap = true;
				}
			}
		};
		
		var toggle_Y_Overlap = function(panel){
			var _deckType = panel.deckType;
			var _deck = cardList(_deckType);
			var card_x_coord = panel.x_coord;
			var card_y_coord = panel.y_coord;
			var _card = cardByCoord(_deckType, card_x_coord, card_y_coord);
			
			var lowest_index = lowestCard(_deckType, card_x_coord);
			var lowest_y_coord = _deck[lowest_index].y_coord;
			
			if(card_y_coord < lowest_y_coord){
				if(_deck[_card].y_overlap && !movingUp){
				// Card overlapped
					setMovingDown(_moveSpeed);
					_deck[_card].y_overlap = false;
					for(var ia = 0; ia < _deck.length; ia++){
						if(_deck[ia].x_coord === card_x_coord){
							if(_deck[ia].y_coord < card_y_coord){
								_deck[ia].y_coord += y_cover;
							}
						}
					}
				} else if(!_deck[_card].y_overlap && !movingDown){
				// Card not overlapped
					setMovingUp(_moveSpeed);
					_deck[_card].y_overlap = true;
					for(var ib = 0; ib < _deck.length; ib++){
						if(card_x_coord === _deck[ib].x_coord){
							if(_deck[ib].y_coord < card_y_coord){
								_deck[ib].y_coord -= y_cover;
							}
						}
					}
				}
			}
		};
		
		var removeCard = function(panel){
		
			// NOT FUNCTIONAL
			
			var _deckType = panel.deckType;
			var _deck = cardList(_deckType);
			var panel_x_coord = _deck[panel].x_coord;
			var panel_y_coord = _deck[panel].y_coord;
			var panel_index = cardByCoord(_deckType, panel_x_coord, panel_y_coord);
			var panel_width = _deck[panel].x_overlap ? x_tab : x_dim;
			var panel_height = _deck[panel].y_overlap ? y_tab : y_dim;
			var lowest_y_coord = _deck[lowestCard(_deckType, panel_x_coord)].y_coord;
			
			_deck.splice(panel_index, 1);
			for(var id = 0; id < _deck.length; id++){
				if(lowest_y_coord > 0){
					if(_deck[id].x_coord === panel_x_coord && _deck[id].y_coord > panel_y_coord){
						_deck[id].y_coord -= panel_height;
					}
					_deck[lowestCard(_deckType, panel_x_coord)].y_overlap = false;
				} else if(lowest_y_coord === 0){
					if(_deck[id].x_coord > panel_x_coord){
						_deck[id].x_coord -= panel_width;
					}
				}
			}
		};
		
		initialize();
		
		return service;
	}]);