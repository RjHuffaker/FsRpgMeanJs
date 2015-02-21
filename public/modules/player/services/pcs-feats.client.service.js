'use strict';

// Factory-service for managing PC card deck.
angular.module('player').factory('PcsFeats', ['Pcs', 'CardDeck', 
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
			for(var ic = 0; ic < Pcs.pc.cardList.length; ic++){
				if(Pcs.pc.cardList[ic].level > Pcs.pc.level){
					CardDeck.removeCard( Pcs.pc.cardList[ic] );
				}
			}
		};
		
		service.featAtLevel = function(level){
			var featAtLevel = false;
			for(var ib = 0; ib < Pcs.pc.cardList.length; ib++){
				if(Pcs.pc.cardList[ib].cardType === 'feat'){
					if(Pcs.pc.cardList[ib].level === level){
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
				x_coord: Pcs.pc.cardList[Pcs.lastCard()].x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Pcs.pc.cardList.push(newFeat);
		};
		
		return service;
	}]);
