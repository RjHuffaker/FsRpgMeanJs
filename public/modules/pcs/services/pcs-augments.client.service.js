'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsAugments', ['Pcs', 'CardDeck', 
	function(Pcs, CardDeck){
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(){
			Pcs.pc.augmentLimit = Math.round((Pcs.pc.level || 0) / 4);
			this.validateAugments();
		};
		
		service.validateAugments = function(){
			for(var ia = 0; ia < Pcs.pc.augmentLimit; ia++){
				if(!this.augmentAtLevel(ia * 4 + 2)){
					this.addAugment(ia * 4 + 2);
				}
			}
			for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
				if(Pcs.pc.cards[ic].level > Pcs.pc.level){
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.augmentAtLevel = function(level){
			var augmentAtLevel = false;
			for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
				if(Pcs.pc.cards[ib].cardType === 'augment'){
					if(Pcs.pc.cards[ib].level === level){
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
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Pcs.pc.cards.push(newAugment);
		};
		
		return service;
	}]);