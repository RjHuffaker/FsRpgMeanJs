'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsCardDeck', ['Pcs',
	function(Pcs){
		var service = {};
		
		var x_dim = 250;
		var y_dim = 350;
		var x_tab = 25;
		var y_tab = 50;
		var x_cover = 225;
		var y_cover = 300;
		
		service.cardMoved = false;		// Disables overlap functions if current press has already triggered another function
		
		service.movingUp = false;
		service.movingDown = false;
		service.movingLeft = false;
		service.movingRight = false;
		
		// Set move booleans
		service.setMovingUp = function(interval){
			service.movingUp = true;
			service.cardMoved = true;
			setTimeout(
				function () {
					service.movingUp = false;
				},
			interval);
		};
		
		service.setMovingDown = function(interval){
			service.movingDown = true;
			service.cardMoved = true;
			setTimeout(
				function(){
					service.movingDown = false;
				},
			interval);
		};
		
		service.setMovingLeft = function(interval){
			service.movingLeft = true;
			service.cardMoved = true;
			setTimeout(
				function(){
					service.movingLeft = false;
				},
			interval);
		};
		
		service.setMovingRight = function(interval){
			service.movingRight = true;
			service.cardMoved = true;
			setTimeout(
				function(){
					service.movingRight = false;
				},
			interval);
		};
		
		// Reset move booleans
		service.onReleaseCard = function(){
			service.cardMoved = false;
			service.movingUp = false;
			service.movingDown = false;
			service.movingLeft = false;
			service.movingRight = false;
		};
		
		// Swap card order along horizontal axis
		service.switchHorizontal = function(slot, panel){
			
			var slot_x_index = slot.x_index;
			var slot_y_index = slot.y_index;
			var slot_x_overlap = slot.x_overlap;
			
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_x_overlap = panel.x_overlap;
			
			if(slot_y_index === 0 && panel_y_index === 0){
				if(panel_x_index - slot_x_index === 1 && !service.movingRight){
				// PANEL MOVING LEFT
					this.setMovingLeft(400);
					for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
						if(Pcs.pc.cards[ia].x_index === slot_x_index){
						// Modify position of each card in "SLOT" column
							Pcs.pc.cards[ia].x_index += 1;
							if(slot_x_index > 0){
								if(panel_x_overlap){
									Pcs.pc.cards[ia].x_coord += x_cover;
								} else {
									Pcs.pc.cards[ia].x_coord += x_dim;
								}
							} else {
								Pcs.pc.cards[ia].x_coord = x_dim;
								Pcs.pc.cards[ia].x_overlap = false;
							}
						} else if(Pcs.pc.cards[ia].x_index === panel_x_index){
						// Modify position of each card in "PANEL" column
							Pcs.pc.cards[ia].x_index -= 1;
							if(slot_x_index > 0){
								if(slot_x_overlap){
									Pcs.pc.cards[ia].x_coord -= x_tab;
								} else {
									Pcs.pc.cards[ia].x_coord -= x_dim;
								}
							} else {
								Pcs.pc.cards[ia].x_coord = 0;
								Pcs.pc.cards[ia].x_overlap = false;
							}
						} else if(slot_x_index === 0 && panel_x_overlap){
							Pcs.pc.cards[ia].x_coord += x_cover;
						}
					}
				} else if(slot_x_index - panel_x_index === 1 && !service.movingLeft){
				// PANEL MOVING RIGHT
					this.setMovingRight(400);
					for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
						if(Pcs.pc.cards[ib].x_index === slot_x_index){
						// Modify position of each card in "SLOT" column
							Pcs.pc.cards[ib].x_index -= 1;
							if(panel_x_index > 0){
								if(panel_x_overlap){
									Pcs.pc.cards[ib].x_coord -= x_tab;
								} else {
									Pcs.pc.cards[ib].x_coord -= x_dim;
								}
							} else {
								Pcs.pc.cards[ib].x_coord = 0;
								Pcs.pc.cards[ib].x_overlap = false;
							}
						} else if(Pcs.pc.cards[ib].x_index === panel_x_index){
						// Modify position of each card in "PANEL" column
							Pcs.pc.cards[ib].x_index += 1;
							if(panel_x_index > 0){
								if(slot_x_overlap){
									Pcs.pc.cards[ib].x_coord += x_tab;
								} else {
									Pcs.pc.cards[ib].x_coord += x_dim;
								}
							} else {
								Pcs.pc.cards[ib].x_coord = x_dim;
								Pcs.pc.cards[ib].x_overlap = false;
							}
						} else if(panel_x_index === 0 && slot_x_overlap){
							Pcs.pc.cards[ib].x_coord += x_cover;
						}
					}
				}
			}
		};
		
		// Swap card order along vertical axis
		service.switchVertical = function(slot, panel){
			var slot_index = Pcs.cardByIndex(slot.x_index, slot.y_index);
			var slot_x_index = slot.x_index;
			var slot_y_index = slot.y_index;
			var slot_y_coord = slot.y_coord;
			var slot_y_overlap = slot.y_overlap;
			
			var panel_index = Pcs.cardByIndex(panel.x_index, panel.y_index);
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_y_coord = panel.y_coord;
			var panel_y_overlap = panel.y_overlap;
			
			if(panel_y_index - slot_y_index === 1 && !service.movingDown){
			// PANEL MOVING UP
				this.setMovingUp(400);
				
				Pcs.pc.cards[slot_index].y_index = panel_y_index;
				Pcs.pc.cards[panel_index].y_index = slot_y_index;
				Pcs.pc.cards[panel_index].y_coord = Pcs.pc.cards[panel_index].y_index * y_tab;
				Pcs.pc.cards[panel_index].y_overlap = false;
				
				for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
					if(Pcs.pc.cards[ia].x_index === slot_x_index){
						if(Pcs.pc.cards[ia].y_index < slot_y_index){
						// Card is above panel
							Pcs.pc.cards[ia].y_coord = Pcs.pc.cards[ia].y_index * y_tab;
							Pcs.pc.cards[ia].y_overlap = true;
						} else if(Pcs.pc.cards[ia].y_index > slot_y_index){
						// card is below panel
							Pcs.pc.cards[ia].y_coord = y_cover + Pcs.pc.cards[ia].y_index * y_tab;
							if(Pcs.pc.cards[ia].y_index < Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_index){
								Pcs.pc.cards[ia].y_overlap = true;
							} else {
								Pcs.pc.cards[ia].y_overlap = false;
							}
						}
					}
				}
			} else if(slot_y_index - panel_y_index === 1 && !service.movingUp){
			// PANEL MOVING DOWN
				this.setMovingDown(400);
				Pcs.pc.cards[slot_index].y_index = panel_y_index;
				Pcs.pc.cards[panel_index].y_index = slot_y_index;
				Pcs.pc.cards[panel_index].y_coord = Pcs.pc.cards[panel_index].y_index * y_tab;
				Pcs.pc.cards[panel_index].y_overlap = false;
				
				for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
					if(Pcs.pc.cards[ib].x_index === slot_x_index){
						if(Pcs.pc.cards[ib].y_index < slot_y_index){
						// Card is above panel
							Pcs.pc.cards[ib].y_coord = Pcs.pc.cards[ib].y_index * y_tab;
							Pcs.pc.cards[ib].y_overlap = true;
						} else if(Pcs.pc.cards[ib].y_index > slot_y_index){
						// card is below panel
							Pcs.pc.cards[ib].y_coord = y_cover + Pcs.pc.cards[ib].y_index * y_tab;
							if(Pcs.pc.cards[ib].y_index < Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_index){
								Pcs.pc.cards[ib].y_overlap = true;
							} else {
								Pcs.pc.cards[ib].y_overlap = false;
							}
						}
					}
				}
			}
		};
		
		service.stackOver = function(slot, panel){
			var slot_index = Pcs.cardByIndex(slot.x_index, slot.y_index);
			var panel_index = Pcs.cardByIndex(panel.x_index, panel.y_index);
			
			var slot_x_index = slot.x_index;
			var slot_y_index = slot.y_index;
			var slot_x_coord = slot.x_coord;
			var slot_y_coord = slot.y_coord;
			var slot_x_overlap = slot.x_overlap;
			var slot_y_overlap = slot.y_overlap;
			var slot_lowest_index = Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_index;
			var slot_lowest_coord = Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_coord;
			
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_x_coord = panel.x_coord;
			var panel_y_coord = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_lowest_index = Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_index;
			var panel_lowest_coord = Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_coord;
			
			if(panel_x_index - slot_x_index === 1 && !service.movingRight){
			// CARD STACKING FROM RIGHT
				this.setMovingRight(400);
				Pcs.pc.cards[slot_index].y_overlap = true;
				Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_overlap = slot_y_overlap;
				for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
					if(Pcs.pc.cards[ia].x_index === panel_x_index){
						Pcs.pc.cards[ia].y_coord += slot_y_coord + y_tab;
						Pcs.pc.cards[ia].y_index += slot_y_index + 1;
					}
					if(Pcs.pc.cards[ia].x_index === slot_x_index && Pcs.pc.cards[ia].y_index > slot_y_index){
						Pcs.pc.cards[ia].y_coord += panel_lowest_coord + y_tab;
						Pcs.pc.cards[ia].y_index += panel_lowest_index + 1;
					}
					if(Pcs.pc.cards[ia].x_index > slot_x_index){
						Pcs.pc.cards[ia].x_coord -= x_dim;
						Pcs.pc.cards[ia].x_index -= 1;
					}
				}
				
			} else if(slot_x_index - panel_x_index === 1 && !service.movingLeft){
			// CARD STACKING FROM LEFT
				this.setMovingLeft(400);
				Pcs.pc.cards[slot_index].y_overlap = true;
				Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_overlap = slot_y_overlap;
				for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
					if(Pcs.pc.cards[ib].x_index === panel_x_index){
						Pcs.pc.cards[ib].y_coord += slot_y_coord + y_tab;
						Pcs.pc.cards[ib].y_index += slot_y_index + 1;
					}
					if(Pcs.pc.cards[ib].x_index > panel_x_index){
						Pcs.pc.cards[ib].x_coord -= x_dim;
						Pcs.pc.cards[ib].x_index -= 1;
						if(Pcs.pc.cards[ib].x_index === panel_x_index && Pcs.pc.cards[ib].y_index > slot_y_index){
							Pcs.pc.cards[ib].y_coord += panel_lowest_coord + y_tab;
							Pcs.pc.cards[ib].y_index += panel_lowest_index + 1;
						}
					}
				}
			}
		};
		
		
		// Stack one card behind another and reposition deck to fill the gap
		service.stackUnder = function(slot, panel){
			var panel_index = Pcs.cardByIndex(panel.x_index, panel.y_index);
			
			var panel_x_index = panel.x_index;
			var panel_y_index = panel.y_index;
			var panel_x_coord = panel.x_coord;
			var panel_y_coord = panel.y_coord;
			var panel_x_overlap = panel.x_overlap;
			var panel_y_overlap = panel.y_overlap;
			var panel_lowest_index = Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_index;
			var panel_lowest_coord = Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_coord;
			
			var slot_x_index = slot.x_index;
			var slot_y_index = slot.y_index;
			var slot_lowest_index = Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_index;
			var slot_lowest_coord = Pcs.pc.cards[Pcs.lowestCard(slot_x_index)].y_coord;
			
			if(panel_x_index - slot_x_index === 1 && !service.movingRight){
			//Card is stacking under from left
				this.setMovingLeft(400);
				Pcs.pc.cards[panel_index].y_overlap = true;
				for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
					if(Pcs.pc.cards[ia].x_index === slot_x_index){
						Pcs.pc.cards[ia].y_coord += panel_lowest_coord + y_tab;
						Pcs.pc.cards[ia].y_index += panel_lowest_index + 1;
					}
					if(Pcs.pc.cards[ia].x_index > slot_x_index){
						Pcs.pc.cards[ia].x_coord -= x_dim;
						Pcs.pc.cards[ia].x_index -= 1;
					}
				}
				
			} else if(slot_x_index - panel_x_index === 1 && !service.movingLeft){
			//Card is stacking under from right
				this.setMovingRight(400);
				Pcs.pc.cards[panel_index].y_overlap = true;
				for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
					if(Pcs.pc.cards[ib].x_index === slot_x_index){
						Pcs.pc.cards[ib].y_coord += panel_lowest_coord + y_tab;
						Pcs.pc.cards[ib].y_index += panel_lowest_index + 1;
					}
					if(Pcs.pc.cards[ib].x_index > panel_x_index){
						Pcs.pc.cards[ib].x_coord -= x_dim;
						Pcs.pc.cards[ib].x_index -= 1;
					}
				}
			}
		};
		
		// Withdraw card from stack and reposition deck to make room
		service.unstackCard = function(slot, panel){
			if(Pcs.pc.cards[Pcs.lowestCard(panel.x_index)].y_index > 0){
				var panel_index = Pcs.cardByIndex(panel.x_index, panel.y_index);
				
				var panel_x_index = panel.x_index;
				var panel_y_index = panel.y_index;
				var panel_x_coord = panel.x_coord;
				var panel_y_coord = panel.y_coord;
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				
				var slot_x_index = slot.x_index;
				
				if(panel_x_index - slot_x_index === 1  && !service.movingLeft){
				// Card is unstacking to the left
					this.setMovingRight(400);
					if(panel_y_overlap){
					// Unstack multiple cards to the left
						for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
							if(Pcs.pc.cards[ia].x_index > panel_x_index){
								Pcs.pc.cards[ia].x_coord += x_dim;
								Pcs.pc.cards[ia].x_index += 1;
							}
							if(Pcs.pc.cards[ia].x_index === panel_x_index){
								if(panel_y_overlap){
									if(Pcs.pc.cards[ia].y_index < panel_y_index){
										Pcs.pc.cards[ia].x_coord += x_dim;
										Pcs.pc.cards[ia].x_index += 1;
									} else if(Pcs.pc.cards[ia].y_index >= panel_y_index){
										Pcs.pc.cards[ia].y_coord -= panel_y_coord;
										Pcs.pc.cards[ia].y_index -= panel_y_index;
									}
								}
							}
						}
					} else if(!panel_y_overlap){							// Unstack single card to the left
						for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
							if(Pcs.pc.cards[ib].x_index >= panel_x_index){
								if(Pcs.pc.cards[ib].x_index === panel_x_index && Pcs.pc.cards[ib].y_index > panel_y_index){
									Pcs.pc.cards[ib].y_coord -= y_dim;
									Pcs.pc.cards[ib].y_index -= 1;
								}
								if(ib !== panel_index){
									Pcs.pc.cards[ib].x_coord += x_dim;
									Pcs.pc.cards[ib].x_index += 1;
								}
							}
						}
						Pcs.pc.cards[panel_index].y_coord = 0;
						Pcs.pc.cards[panel_index].y_index = 0;
					}
					Pcs.pc.cards[Pcs.lowestCard(panel_x_index + 1)].y_overlap = false;
				} else if(slot_x_index - panel_x_index === 1 && !service.movingLeft){
				//Card is unstacking to the right
					this.setMovingLeft(400);
					if(panel_y_overlap){
					// Unstack multiple cards to the right
						for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
							if(Pcs.pc.cards[ic].x_index > panel_x_index){
								Pcs.pc.cards[ic].x_coord += x_dim;
								Pcs.pc.cards[ic].x_index += 1;
							}
							if(Pcs.pc.cards[ic].x_index === panel_x_index){
								if(Pcs.pc.cards[ic].y_index >= panel_y_index){
									Pcs.pc.cards[ic].x_index += 1;
									Pcs.pc.cards[ic].x_coord += x_dim;
									Pcs.pc.cards[ic].y_index -= panel_y_index;
									Pcs.pc.cards[ic].y_coord -= panel_y_coord;
								}
							}
						}
					} else if(!panel_y_overlap){
					// Unstack single (un-overlapped) card to the right
						for(var id = 0; id < Pcs.pc.cards.length; id++){
							if(Pcs.pc.cards[id].x_index > panel_x_index){
								Pcs.pc.cards[id].x_coord += x_dim;
								Pcs.pc.cards[id].x_index += 1;
							}
							if(Pcs.pc.cards[id].x_index === panel_x_index && Pcs.pc.cards[id].y_index > panel_y_index){
								Pcs.pc.cards[id].y_coord -= y_dim;
								Pcs.pc.cards[id].y_index -= 1;
							}
						}
						Pcs.pc.cards[panel_index].x_coord += x_dim;
						Pcs.pc.cards[panel_index].x_index += 1;
						Pcs.pc.cards[panel_index].y_coord = 0;
						Pcs.pc.cards[panel_index].y_index = 0;
					}
					Pcs.pc.cards[Pcs.lowestCard(panel_x_index)].y_overlap = false;
				}
			}
		};
		
		// Gatekeeper function for x_overlap and y_overlap
		service.toggleOverlap = function(card){
			if(!service.cardMoved){
				if(card.x_index > 0 && Pcs.pc.cards[Pcs.lowestCard(card.x_index)].y_index === 0){
					this.toggle_X_Overlap(card);
				} else if(card.y_index !== Pcs.pc.cards[Pcs.lowestCard(card.x_index)].y_index){
					this.toggle_Y_Overlap(card);
				}
			}
		};
		
		service.toggle_X_Overlap = function(card){
			var x_index = card.x_index;
			var y_index = card.y_index;
			var _card = Pcs.cardByIndex(x_index, y_index);
			if(x_index > 0){
				if(Pcs.pc.cards[_card].x_overlap){
					for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
						if(x_index <= Pcs.pc.cards[ia].x_index){
							Pcs.pc.cards[ia].x_coord += x_cover;
						}
					}
					Pcs.pc.cards[_card].x_overlap = false;
				} else if(!Pcs.pc.cards[_card].x_overlap){
					for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
						if(x_index <= Pcs.pc.cards[ib].x_index){
							Pcs.pc.cards[ib].x_coord -= x_cover;
						}
					}
					Pcs.pc.cards[_card].x_overlap = true;
				}
			}
		};
		
		service.toggle_Y_Overlap = function(card){
			var card_x_index = card.x_index;
			var card_y_index = card.y_index;
			var card_index = Pcs.cardByIndex(card_x_index, card_y_index);
			var card_y_overlap = card.y_overlap;
			var lowest_index = Pcs.lowestCard(card_x_index);
			var lowest_y_index = Pcs.pc.cards[lowest_index].y_index;
			
			if(card_y_index < lowest_y_index){
				if(Pcs.pc.cards[card_index].y_overlap){
				// Card currently overlapped
					Pcs.pc.cards[card_index].y_coord = Pcs.pc.cards[card_index].y_index * y_tab;
					Pcs.pc.cards[card_index].y_overlap = false;
					for(var ia = 0; ia < Pcs.pc.cards.length; ia++){
						if(Pcs.pc.cards[ia].x_index === card_x_index){
							if(Pcs.pc.cards[ia].y_index < card_y_index){
								Pcs.pc.cards[ia].y_coord = Pcs.pc.cards[ia].y_index * y_tab;
								Pcs.pc.cards[ia].y_overlap = true;
							} else if(Pcs.pc.cards[ia].y_index > card_y_index){
								Pcs.pc.cards[ia].y_coord = y_cover + Pcs.pc.cards[ia].y_index * y_tab;
								if(Pcs.pc.cards[ia].y_index < lowest_y_index){
									Pcs.pc.cards[ia].y_overlap = true;
								}
							}
						}
					}
				} else if(!Pcs.pc.cards[card_index].y_overlap){
				// Card not overlapped
					for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
						if(card_x_index === Pcs.pc.cards[ib].x_index){
							Pcs.pc.cards[ib].y_coord = Pcs.pc.cards[ib].y_index * y_tab;
							if(Pcs.pc.cards[ib].y_index < lowest_y_index){
								Pcs.pc.cards[ib].y_overlap = true;
							}
						}
					}
					Pcs.pc.cards[card_index].y_overlap = true;
				}
			}
		};
		
		service.removeCard = function(card){
			var card_x_index = Pcs.pc.cards[card].x_index;
			var card_width = Pcs.pc.cards[card].x_overlap ? x_tab : Pcs.pc.cards[card].x_dim;
			var card_y_index = Pcs.pc.cards[card].y_index;
			var card_height = Pcs.pc.cards[card].y_overlap ? y_tab : Pcs.pc.cards[card].y_dim;
			var lowest_y_index = Pcs.pc.cards[Pcs.lowestCard(card_x_index)].y_index;
			Pcs.pc.cards.splice(card, 1);
			for(var id = 0; id < Pcs.pc.cards.length; id++){
				if(lowest_y_index > 0){
					if(lowest_y_index > 0 ){
						if(Pcs.pc.cards[id].x_index === card_x_index && Pcs.pc.cards[id].y_index > card_y_index){
							Pcs.pc.cards[id].y_index -= 1;
							Pcs.pc.cards[id].y_coord -= card_height;
						}
						Pcs.pc.cards[Pcs.lowestCard(card_x_index)].y_overlap = false;
					}
				} else if(lowest_y_index === 0){
					if(Pcs.pc.cards[id].x_index > card_x_index){
						Pcs.pc.cards[id].x_index -= 1;
						Pcs.pc.cards[id].x_coord -= card_width;
					}
				}
			}
		};
		
		
		return service;
	}]);