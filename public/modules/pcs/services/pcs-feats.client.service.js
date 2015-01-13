'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsFeats', ['Pcs', 'CardDeck', 
	function(Pcs, CardDeck){
		var service = {};
		
		// Factor Feat Limit
		service.factorFeatLimit = function(){
			Pcs.pc.featLimit = Math.ceil((Pcs.pc.level) / 4) || 0;
			Pcs.pc.featDeck = Pcs.pc.level;
			this.validateFeats();
		};
		
		service.validateFeats = function(){
			for(var ia = 0; ia < Pcs.pc.featDeck; ia++){
				if(!this.featAtLevel(ia + 1)){
					this.addFeat(ia + 1);
				}
			}
			for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
				if(Pcs.pc.cards[ic].level > Pcs.pc.level){
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.featAtLevel = function(level){
			var featAtLevel = false;
			for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
				if(Pcs.pc.cards[ib].cardType === 'feat'){
					if(Pcs.pc.cards[ib].level === level){
						featAtLevel = true;
					}
				}
			}
			return featAtLevel;
		};
		
		service.addFeat = function(level){
			var newFeat = {
				name: 'Level '+level+' Feat',
				cardType: 'feat',
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 10,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Pcs.pc.cards.push(newFeat);
		};
		
		return service;
	}]);