'use strict';

// Factory-service for managing PC traits
angular.module('pcs').factory('PcsTraits', ['$resource', 'BREAD', 'CardDeck', 
	function($resource, BREAD, CardDeck){
		
		var service = {};
		
		var Traits = $resource(
			'traits/:traitId',
			{ traitId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		// Factor Trait Limit
		service.factorTraitLimit = function(){
			BREAD.resource.traitLimit = Math.floor((BREAD.resource.level || 0) / 4 + 1);
			this.validateTraits();
		};
		
		service.validateTraits = function(){
			for(var ia = 0; ia < BREAD.resource.traitLimit; ia++){
				if(!this.traitAtLevel(ia * 4)){
					this.addTrait(ia * 4);
				}
			}
			for(var ic = 0; ic < BREAD.resource.cardList.length; ic++){
				if(BREAD.resource.cardList[ic].level > BREAD.resource.level){
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.traitAtLevel = function(level){
			var traitAtLevel = false;
			for(var ib = 0; ib < BREAD.resource.cardList.length; ib++){
				if(BREAD.resource.cardList[ib].cardType === 'trait'){
					if(BREAD.resource.cardList[ib].level === level){
						traitAtLevel = true;
					}
				}
			}
			return traitAtLevel;
		};
		
		service.addTrait = function(level){
			var newTrait = {
				name: 'Level '+level+' Trait',
				cardType: 'trait',
				x_coord: BREAD.resource.cardList[BREAD.lastCard()].x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			BREAD.resource.cardList.push(newTrait);
		};
		
		service.lockCard = function(card){
			card.cardRole = 'player';
			card.locked = true;
			card.x_coord = (card.cardNumber - 1) * 15;
			card.y_coord = 0;
			card.dragging = false;
			card.stacked = false;
		};
		
		return service;
	}]);