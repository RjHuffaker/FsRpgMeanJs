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
		var x_cover = 8;
		var y_cover = 12;
		var _moveSpeed = 500;
		var cardMoved = false;
		var movingUp = false;
		var movingDown = false;
		var movingLeft = false;
		var movingRight = false;
		var deckList = [];
		
		var getCardList = function(deckType){
			if(deckType === 'pc'){
				return Pcs.pc.cards;
			} else if(deckType === 'card'){
				return Cards.getCardList;
			} else if(deckType === 'home'){
				return HomeDemo.cards;
			}
		};
		
		var getCardIndex = function(deckType, x_coord, y_coord){
			var _deck = getCardList(deckType);
			var _card = {};
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord === x_coord && _deck[i].y_coord === y_coord){
					return i;
				}
			}
		};
		
		var getFirstIndex = function(deckType){
			return getCardIndex(deckType, 0, 0);
		};
		
		service.getLastIndex = function(deckType){
			var _deck = getCardList(deckType);
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
		
		service.getDeckWidth = function(deckType){
			var _deck = getCardList(deckType);
			return _deck[service.getLastIndex(deckType)].x_coord + 10;
		};
		
		var getLastIndex = function(cardType){
			var _deck = getCardList(cardType);
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
		
		var getLowestIndex = function(cardType, x_coord) {
			var _deck = getCardList(cardType);
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
			var panel = object.panel;
			var _deck = getCardList(panel.deckType);
			
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			
			for(var ia = 0; ia < _deck.length; ia++){
				if(panel_x === _deck[ia].x_coord){
					if(!panel_y_overlap && panel_y === _deck[ia].y_coord){
						_deck[ia].dragging = true;
					} else if(panel_y_overlap && panel_y <= _deck[ia].y_coord){
						_deck[ia].dragging = true;
					}
				}
			}
			$rootScope.$digest();
		};
		
		// Reset move variables
		var onReleaseCard = function(event, object){
			cardMoved = false;
			movingUp = false;
			movingDown = false;
			movingLeft = false;
			movingRight = false;
			
			var _deck = getCardList(object.panel.deckType);
			for(var ia = 0; ia < _deck.length; ia++){
				_deck[ia].dragging = false;
			}
			$rootScope.$digest();
		};
		
		var moveHorizontal = function(event, object){
			console.log('move horizontal');
			var _slot = object.slot;
			var _panel = object.panel;
			var _deckType = _panel.deckType;
			var _deck = getCardList(_deckType);
			var _lowest_index = getLowestIndex(_deckType, _panel.x_coord);
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
			var _deck = getCardList(_deckType);
			var _lowest_index = getLowestIndex(_deckType, _panel.x_coord);
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
			var _deck = getCardList(_deckType);
			var _lowest_index = getLowestIndex(_deckType, _panel.x_coord);
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
				var _deck = getCardList(_deckType);
				var unstack_coord = _deck[getLastIndex(_deckType)].x_coord - x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		var unstackRight = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deckType = _panel.deckType;
				var _deck = getCardList(_deckType);
				var unstack_coord = _deck[getLastIndex(_deckType)].x_coord + x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		// Swap card order along horizontal axis
		var switchHorizontal = function(slot, panel){
			console.log('switch horizontal');
			var _deckType = panel.deckType;
			var _deck = getCardList(_deckType);
			
			var slot_x = slot.x_coord;
			var slot_y = slot.y_coord;
			var slot_x_overlap = slot.x_overlap;
			
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			
			if(slot_y === 0 && panel_y === 0){
				if(panel_x - slot_x > 0 && !movingRight){
				// PANEL MOVING LEFT
					setMovingLeft(_moveSpeed);
					for(var ia = 0; ia < _deck.length; ia++){
						if(_deck[ia].x_coord === slot_x){
						// Modify position of each card in "SLOT" column
							if(slot_x > 0){
								if(panel_x_overlap){
									_deck[ia].x_coord += x_tab;
								} else {
									_deck[ia].x_coord += x_dim;
								}
							} else {
								_deck[ia].x_coord = x_dim;
								_deck[ia].x_overlap = false;
							}
						} else if(_deck[ia].x_coord === panel_x){
						// Modify position of each card in "PANEL" column
							if(slot_x > 0){
								if(slot_x_overlap){
									_deck[ia].x_coord -= x_tab;
								} else {
									_deck[ia].x_coord -= x_dim;
								}
							} else {
								_deck[ia].x_coord = 0;
								_deck[ia].x_overlap = false;
							}
						} else if(slot_x === 0 && panel_x_overlap){
							_deck[ia].x_coord += x_cover;
						}
					}
				} else if(panel_x - slot_x < 0 && !movingLeft){
				// PANEL MOVING RIGHT
					setMovingRight(_moveSpeed);
					for(var ib = 0; ib < _deck.length; ib++){
						if(_deck[ib].x_coord === slot_x){
						// Modify position of each card in "SLOT" column
							if(panel_x > 0){
								if(panel_x_overlap){
									_deck[ib].x_coord -= x_tab;
								} else {
									_deck[ib].x_coord -= x_dim;
								}
							} else {
								_deck[ib].x_coord = 0;
								_deck[ib].x_overlap = false;
							}
						} else if(_deck[ib].x_coord === panel_x){
						// Modify position of each card in "PANEL" column
							if(panel_x > 0){
								if(slot_x_overlap){
									_deck[ib].x_coord += x_tab;
								} else {
									_deck[ib].x_coord += x_dim;
								}
							} else {
								_deck[ib].x_coord = x_dim;
								_deck[ib].x_overlap = false;
							}
						} else if(panel_x === 0 && slot_x_overlap){
							_deck[ib].x_coord += x_cover;
						}
					}
				}
			}
		};
		
		// Swap card order along vertical axis
		var switchVertical = function(slot, panel){
			var _deckType = slot.deckType;
			var _deck = getCardList(_deckType);
			
			var slot_x = slot.x_coord;
			var slot_y = slot.y_coord;
			var slot_index = getCardIndex(_deckType, slot_x, slot_y);
			var slot_y_overlap = slot.y_overlap;
			
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = getCardIndex(_deckType, panel_x, panel_y);
			var panel_y_overlap = panel.y_overlap;
			
			var lowest_index = getLowestIndex(_deckType, slot_x);
			var lowest_y = _deck(lowest_index).y_coord;
			
			if(panel_y - slot_y > 0 && !movingDown){
			// PANEL MOVING UP
				setMovingUp(_moveSpeed);
				
				_deck[slot_index].y_coord = panel_y;
				_deck[panel_index].y_coord = slot_y;
			} else if(panel_y - slot_y < 0 && !movingUp){
			// PANEL MOVING DOWN
				setMovingDown(_moveSpeed);
				
				_deck[slot_index].y_coord = panel_y;
				_deck[panel_index].y_coord = slot_y;
			}
			for(var ia = 0; ia < _deck.length; ia++){
				if(_deck[ia].x_coord === slot_x && _deck[ia].y_coord !== lowest_y){
					if(_deck[ia].y_coord !== slot_y && !_deck[ia].y_overlap){
						toggleOverlap();
					}
				}
			}
		};
		
		var stackOver = function(slot, panel){
			var _deckType = slot.deckType;
			var _deck = getCardList(_deckType);
			
			var slot_x = slot.x_coord;
			var slot_y = slot.y_coord;
			var slot_index = getCardIndex(_deckType, slot_x, slot_y);
			var slot_x_overlap = slot.x_overlap;
			var slot_y_overlap = slot.y_overlap;
			var slot_lowest_coord = _deck[getLowestIndex(_deckType, slot_x)].y_coord;
			
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = getCardIndex(_deckType, panel_x, panel_y);
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_lowest_coord = _deck[getLowestIndex(_deckType, panel_x)].y_coord;
			
			if(!slot_x_overlap && !panel_x_overlap){
				if(panel_x - slot_x > 0 && !movingLeft){
				// CARD STACKING FROM RIGHT
					setMovingRight(_moveSpeed);
					_deck[slot_index].y_overlap = true;
					_deck[slot_index].stacked = true;
					_deck[panel_index].stacked = true;
					_deck[getLowestIndex(_deckType, panel_x)].y_overlap = slot_y_overlap;
					for(var ia = 0; ia < _deck.length; ia++){
						if(_deck[ia].x_coord === panel_x){
							_deck[ia].y_coord += slot_y + y_tab;
						}
						if(_deck[ia].x_coord === slot_x && _deck[ia].y_coord > slot_y){
							_deck[ia].y_coord += panel_lowest_coord + y_tab;
						}
						if(_deck[ia].x_coord > slot_x){
							_deck[ia].x_coord -= x_dim;
						}
					}
					
				} else if(panel_x - slot_x < 0 && !movingRight){
				// CARD STACKING FROM LEFT
					setMovingLeft(_moveSpeed);
					_deck[slot_index].y_overlap = true;
					_deck[slot_index].stacked = true;
					_deck[panel_index].stacked = true;
					_deck[getLowestIndex(_deckType, panel_x)].y_overlap = slot_y_overlap;
					for(var ib = 0; ib < _deck.length; ib++){
						if(_deck[ib].x_coord === panel_x){
							_deck[ib].y_coord += slot_y + y_tab;
						}
						if(_deck[ib].x_coord > panel_x){
							_deck[ib].x_coord -= x_dim;
							if(_deck[ib].x_coord === panel_x && _deck[ib].y_coord > slot_y){
								_deck[ib].y_coord += panel_lowest_coord + y_tab;
							}
						}
					}
				}
			}
		};
		
		
		// Stack one card behind another and reposition deck to fill the gap
		var stackUnder = function(slot, panel){
			var _deckType = slot.deckType;
			var _deck = getCardList(_deckType);
			
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = getCardIndex(_deckType, panel_x, panel_y);
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_lowest_coord = _deck[getLowestIndex(_deckType, panel_x)].y_coord;
			
			var slot_x = slot.x_coord;
			var slot_y = slot.y_coord;
			var slot_index = getCardIndex(_deckType, slot_x, slot_y);
			var slot_lowest_coord = _deck[getLowestIndex(_deckType, slot_x)].y_coord;
			
			if(panel_x - slot_x > 0 && !movingRight){
			//Card is stacking under from left
				setMovingLeft(_moveSpeed);
				_deck[panel_index].y_overlap = true;
				_deck[slot_index].stacked = true;
				_deck[panel_index].stacked = true;
				for(var ia = 0; ia < _deck.length; ia++){
					if(_deck[ia].x_coord === slot_x){
						_deck[ia].y_coord += panel_lowest_coord + y_tab;
					}
					if(_deck[ia].x_coord > slot_x){
						_deck[ia].x_coord -= x_dim;
					}
				}
				
			} else if(panel_x - slot_x < 0 && !movingLeft){
			//Card is stacking under from right
				setMovingRight(_moveSpeed);
				_deck[panel_index].y_overlap = true;
				_deck[slot_index].stacked = true;
				_deck[panel_index].stacked = true;
				for(var ib = 0; ib < _deck.length; ib++){
					if(_deck[ib].x_coord === slot_x){
						_deck[ib].y_coord += panel_lowest_coord + y_tab;
					}
					if(_deck[ib].x_coord > panel_x){
						_deck[ib].x_coord -= x_dim;
					}
				}
			}
		};
		
		// Withdraw card from stack and reposition deck to make room
		var unstackCard = function(slot, panel){
			var _deckType = panel.deckType;
			var _deck = getCardList(_deckType);
			
			if(_deck[getLowestIndex(_deckType, panel.x_coord)].y_coord > 0){
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(_deckType, panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var slot_x = slot.x_coord;
				
				var new_slot_index, new_panel_index;
				
				if(panel_x - slot_x > 0  && !movingLeft){
				// Card is unstacking to the left
					setMovingRight(_moveSpeed);
					if(panel_y_overlap){
					// Unstack multiple cards to the left
						for(var ia = 0; ia < _deck.length; ia++){
							if(_deck[ia].x_coord > panel_x){
								_deck[ia].x_coord += x_dim;
							}
							if(_deck[ia].x_coord === panel_x){
								if(panel_y_overlap){
									if(_deck[ia].y_coord < panel_y){
										_deck[ia].x_coord += x_dim;
									} else if(_deck[ia].y_coord >= panel_y){
										_deck[ia].y_coord -= panel_y;
									}
								}
							}
						}
					} else if(!panel_y_overlap){
					// Unstack single card to the left
						for(var ib = 0; ib < _deck.length; ib++){
							if(_deck[ib].x_coord >= panel_x){
								if(_deck[ib].x_coord === panel_x && _deck[ib].y_coord > panel_y){
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
					new_slot_index = getLowestIndex(_deckType, panel_x);
					new_panel_index = getLowestIndex(_deckType, panel_x + 10);
					
					_deck[new_slot_index].y_overlap = false;
					if(_deck[new_slot_index].y_coord === 0){
						_deck[new_slot_index].stacked = false;
					}
					
					_deck[new_panel_index].y_overlap = false;
					if(_deck[new_panel_index].y_coord === 0){
						_deck[new_panel_index].stacked = false;
					}
				} else if(panel_x - slot_x < 0 && !movingRight){
				//Card is unstacking to the right
					setMovingLeft(_moveSpeed);
					if(panel_y_overlap){
					// Unstack multiple cards to the right
						for(var ic = 0; ic < _deck.length; ic++){
							if(_deck[ic].x_coord > panel_x){
								_deck[ic].x_coord += x_dim;
							}
							if(_deck[ic].x_coord === panel_x){
								if(_deck[ic].y_coord >= panel_y){
									_deck[ic].x_coord += x_dim;
									_deck[ic].y_coord -= panel_y;
								}
							}
						}
					} else if(!panel_y_overlap){
					// Unstack single card to the right
						for(var id = 0; id < _deck.length; id++){
							if(_deck[id].x_coord > panel_x){
								_deck[id].x_coord += x_dim;
							}
							if(_deck[id].x_coord === panel_x && _deck[id].y_coord > panel_y){
								_deck[id].y_coord -= y_dim;
							}
						}
						_deck[panel_index].x_coord += x_dim;
						_deck[panel_index].y_coord = 0;
					}
					
					new_slot_index = getLowestIndex(_deckType, panel_x);
					new_panel_index = getLowestIndex(_deckType, slot_x);
					
					_deck[new_slot_index].y_overlap = false;
					if(_deck[new_slot_index].y_coord === 0){
						_deck[new_slot_index].stacked = false;
					}
					
					_deck[new_panel_index].y_overlap = false;
					if(_deck[new_panel_index].y_coord === 0){
						_deck[new_panel_index].stacked = false;
					}
				}
			}
			$rootScope.$digest();
		};
		
		// Function for x_overlap and y_overlap
		var toggleOverlap = function(event, object){
			var panel = object.panel;
			var _deckType = panel.deckType;
			var _deck = getCardList(_deckType);
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_index = getCardIndex(_deckType, panel_x, panel_y);
			var lowest_index = getLowestIndex(_deckType, panel_x);
			var lowest_y = _deck[lowest_index].y_coord;
			
			_deck[panel_index].dragging = false;
			
			if(!cardMoved){
				if(panel_x > 0 && lowest_y === 0){
				// x_overlap
					if(panel_x_overlap && !movingLeft){
					// Card overlapped
						setMovingRight(_moveSpeed);
						_deck[panel_index].x_overlap = false;
						for(var ia = 0; ia < _deck.length; ia++){
							_deck[ia].dragging = false;
							if(panel_x <= _deck[ia].x_coord){
								_deck[ia].x_coord += x_cover;
							}
						}
					} else if(!panel_x_overlap && !movingRight){
					// Card not overlapped
						setMovingLeft(_moveSpeed);
						_deck[panel_index].x_overlap = true;
						for(var ib = 0; ib < _deck.length; ib++){
							_deck[ib].dragging = false;
							if(panel_x <= _deck[ib].x_coord){
								_deck[ib].x_coord -= x_cover;
							}
						}
					}
				} else if(panel_y !== lowest_y){
				// y_overlap
					if(panel_y_overlap && !movingUp){
					// Card overlapped
						setMovingDown(_moveSpeed);
						_deck[panel_index].y_overlap = false;
						for(var ic = 0; ic < _deck.length; ic++){
							_deck[ic].dragging = false;
							if(panel_x === _deck[ic].x_coord){
								if(panel_y < _deck[ic].y_coord){
									_deck[ic].y_coord += y_cover;
								}
							}
						}
					} else if(!panel_y_overlap && !movingDown){
					// Card not overlapped
						console.log('not over');
						setMovingUp(_moveSpeed);
						_deck[panel_index].y_overlap = true;
						for(var id = 0; id < _deck.length; id++){
							_deck[id].dragging = false;
							if(panel_x === _deck[id].x_coord){
								if(panel_y < _deck[id].y_coord){
									_deck[id].y_coord -= y_cover;
								}
							}
						}
					}
				}
				cardMoved = false;
				$rootScope.$digest();
			}
		};
		
		var removeCard = function(panel){
		
			// NOT FUNCTIONAL
			
			var _deckType = panel.deckType;
			var _deck = getCardList(_deckType);
			var panel_x = _deck[panel].x_coord;
			var panel_y = _deck[panel].y_coord;
			var panel_index = getCardIndex(_deckType, panel_x, panel_y);
			var panel_width = _deck[panel].x_overlap ? x_tab : x_dim;
			var panel_height = _deck[panel].y_overlap ? y_tab : y_dim;
			var lowest_y_coord = _deck[getLowestIndex(_deckType, panel_x)].y_coord;
			
			_deck.splice(panel_index, 1);
			for(var id = 0; id < _deck.length; id++){
				if(lowest_y_coord > 0){
					if(_deck[id].x_coord === panel_x && _deck[id].y_coord > panel_y){
						_deck[id].y_coord -= panel_height;
					}
					_deck[getLowestIndex(_deckType, panel_x)].y_overlap = false;
				} else if(lowest_y_coord === 0){
					if(_deck[id].x_coord > panel_x){
						_deck[id].x_coord -= panel_width;
					}
				}
			}
		};
		
		initialize();
		
		return service;
	}]);