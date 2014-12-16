'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsAugments', ['Pcs', 'PcsCardDeck', 
	function(Pcs, PcsCardDeck){
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(){
			Pcs.pc.cards[1].augmentLimit = Math.round((Pcs.pc.cards[1].level || 0) / 4);
			this.validateAugments();
		};
		
		service.validateAugments = function(){
			for(var ia = 0; ia < Pcs.pc.cards[1].augmentLimit; ia++){
				if(!this.augmentAtLevel(ia * 4 + 2)){
					this.addAugment(ia * 4 + 2);
				}
			}
			for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
				if(Pcs.pc.cards[ic].level > Pcs.pc.cards[1].level){
					PcsCardDeck.removeCard(ic);
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
				x_index: Pcs.pc.cards[Pcs.lastCard()].x_index + 1,
				y_index: 0,
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 250,
				y_coord: 0,
				x_dim: 250,
				y_dim: 350,
				x_overlap: false,
				y_overlap: false,
				locked: true,
				level: level
			};
			Pcs.pc.cards.push(newAugment);
		};
		
		return service;
	}]);