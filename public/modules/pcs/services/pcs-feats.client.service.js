'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsFeats', ['BREAD', 'CardDeck', 
	function(BREAD, CardDeck){
		var service = {};
		
		// Factor Feat Limit
		service.factorFeatLimit = function(){
			BREAD.resource.featLimit = Math.ceil((BREAD.resource.level) / 4) || 0;
			BREAD.resource.featDeck = BREAD.resource.level;
			this.validateFeats();
		};
		
		service.validateFeats = function(){
			for(var ia = 0; ia < BREAD.resource.featDeck; ia++){
				if(!this.featAtLevel(ia + 1)){
					this.addFeat(ia + 1);
				}
			}
			for(var ic = 0; ic < BREAD.resource.cardList.length; ic++){
				if(BREAD.resource.cardList[ic].level > BREAD.resource.level){
					CardDeck.removeCard( BREAD.resource.cardList[ic] );
				}
			}
		};
		
		service.featAtLevel = function(level){
			var featAtLevel = false;
			for(var ib = 0; ib < BREAD.resource.cardList.length; ib++){
				if(BREAD.resource.cardList[ib].cardType === 'feat'){
					if(BREAD.resource.cardList[ib].level === level){
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
				x_coord: BREAD.resource.cardList[BREAD.lastCard()].x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			BREAD.resource.cardList.push(newFeat);
		};
		
		return service;
	}]);
