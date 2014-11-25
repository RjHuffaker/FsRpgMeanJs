'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsTraits', ['Pcs',
	function(Pcs){
		var service = {};
		
		// Factor Trait Limit
		service.factorTraitLimit = function(){
			Pcs.pc.cards[1].traitLimit = Math.floor((Pcs.pc.cards[1].level || 0) / 4 + 1);
			this.validateTraits();
		};
		
		service.validateTraits = function(){
			for(var iA = 0; iA < Pcs.pc.cards[1].traitLimit; iA++){
				if(!this.traitAtLevel(iA * 4)){
					this.addTrait(iA * 4);
				}
			}
			for(var iC = 0; iC < Pcs.pc.cards.length; iC++){
				if(Pcs.pc.cards[iC].level > Pcs.pc.cards[1].level){
					this.removeTrait(iC);
				}
			}
		};
		
		service.traitAtLevel = function(level){
			var traitAtLevel = false;
			for(var iB = 0; iB < Pcs.pc.cards.length; iB++){
				if(Pcs.pc.cards[iB].cardType === 'pcTrait'){
					if(Pcs.pc.cards[iB].level === level){
						traitAtLevel = true;
					}
				}
			}
			return traitAtLevel;
		};
		
		service.addTrait = function(level){
			var newTrait = {
				cardType: 'pcTrait',
				x_index: Pcs.pc.cards.length,
				y_index: 0,
				x_coord: Pcs.pc.cards[Pcs.cardBy_X_Index(Pcs.pc.cards.length - 1)].x_coord + 250,
				y_coord: 0,
				overlap: false,
				level: level
			};
			Pcs.pc.cards.push(newTrait);
		};
		
		service.removeTrait = function(card){
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