'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsAugments', ['Pcs',
	function(Pcs){
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(){
			Pcs.pc.cards[1].augmentLimit = Math.round((Pcs.pc.cards[1].level || 0) / 4);
			this.validateAugments();
		};
		
		service.validateAugments = function(){
			for(var iA = 0; iA < Pcs.pc.cards[1].augmentLimit; iA++){
				if(!this.augmentAtLevel(iA * 4 + 2)){
					this.addAugment(iA * 4 + 2);
				}
			}
			for(var iC = 0; iC < Pcs.pc.cards.length; iC++){
				if(Pcs.pc.cards[iC].level > Pcs.pc.cards[1].level){
					this.removeAugment(iC);
				}
			}
		};
		
		service.augmentAtLevel = function(level){
			var augmentAtLevel = false;
			for(var iB = 0; iB < Pcs.pc.cards.length; iB++){
				if(Pcs.pc.cards[iB].cardType === 'pcAugment'){
					if(Pcs.pc.cards[iB].level === level){
						augmentAtLevel = true;
					}
				}
			}
			return augmentAtLevel;
		};
		
		service.addAugment = function(level){
			var newAugment = {
				cardType: 'pcAugment',
				x_index: Pcs.pc.cards.length,
				y_index: 0,
				x_coord: Pcs.pc.cards[Pcs.cardBy_X_Index(Pcs.pc.cards.length - 1)].x_coord + 250,
				y_coord: 0,
				overlap: false,
				level: level
			};
			Pcs.pc.cards.push(newAugment);
		};
		
		service.removeAugment = function(card){
			var removeIndex = Pcs.pc.cards[card].x_index;
			var removeColumn = Pcs.pc.cards[card].overlap ? 25 : 250;
			Pcs.pc.cards.splice(card, 1);
			for(var iD = 0; iD < Pcs.pc.cards.length; iD++){
				if(Pcs.pc.cards[iD].x_index > removeIndex){
					Pcs.pc.cards[iD].x_index -= 1;
					Pcs.pc.cards[iD].x_coord -= removeColumn;
				}
			}
		};
		
		return service;
	}]);