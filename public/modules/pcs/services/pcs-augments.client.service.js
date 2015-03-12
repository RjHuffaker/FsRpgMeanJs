'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsAugments', ['BREAD', 'CardDeck', 
	function(BREAD, CardDeck){
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(){
			BREAD.resource.augmentLimit = Math.round((BREAD.resource.level || 0) / 4);
			this.validateAugments();
		};
		
		service.validateAugments = function(){
			for(var ia = 0; ia < BREAD.resource.augmentLimit; ia++){
				if(!this.augmentAtLevel(ia * 4 + 2)){
					this.addAugment(ia * 4 + 2);
				}
			}
			for(var ic = 0; ic < BREAD.resource.cardList.length; ic++){
				if(BREAD.resource.cardList[ic].level > BREAD.resource.level){
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.augmentAtLevel = function(level){
			var augmentAtLevel = false;
			for(var ib = 0; ib < BREAD.resource.cardList.length; ib++){
				if(BREAD.resource.cardList[ib].cardType === 'augment'){
					if(BREAD.resource.cardList[ib].level === level){
						augmentAtLevel = true;
					}
				}
			}
			return augmentAtLevel;
		};
		
		service.addAugment = function(level){
			var newAugment = {
				name: 'Level '+level+' Augment',
				cardType: 'augment',
				x_coord: BREAD.resource.cardList[BREAD.lastCard()].x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			BREAD.resource.cardList.push(newAugment);
		};
		
		return service;
	}]);