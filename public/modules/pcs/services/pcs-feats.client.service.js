'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsFeats', ['Pcs',
	function(Pcs){
		var service = {};
		
		// Factor Feat Limit
		service.factorFeatLimit = function(){
			Pcs.pc.cards[1].featLimit = Math.ceil((Pcs.pc.cards[1].level) / 4) || 0;
			Pcs.pc.cards[1].featDeck = Pcs.pc.cards[1].level;
			this.validateFeats();
		};
		
		service.validateFeats = function(){
			for(var iA = 0; iA < Pcs.pc.cards[1].featDeck; iA++){
				if(!this.featAtLevel(iA + 1)){
					this.addFeat(iA + 1);
				}
			}
			for(var iC = 0; iC < Pcs.pc.cards.length; iC++){
				if(Pcs.pc.cards[iC].level > Pcs.pc.cards[1].level){
					this.removeFeat(iC);
				}
			}
		};
		
		service.featAtLevel = function(level){
			var featAtLevel = false;
			for(var iB = 0; iB < Pcs.pc.cards.length; iB++){
				if(Pcs.pc.cards[iB].cardType === 'pcFeat'){
					if(Pcs.pc.cards[iB].level === level){
						featAtLevel = true;
					}
				}
			}
			return featAtLevel;
		};
		
		service.addFeat = function(level){
			var newFeat = {
				cardType: 'pcFeat',
				x_index: Pcs.pc.cards.length,
				y_index: 0,
				x_coord: Pcs.pc.cards[Pcs.cardBy_X_Index(Pcs.pc.cards.length - 1)].x_coord + 250,
				y_coord: 0,
				overlap: false,
				level: level
			};
			Pcs.pc.cards.push(newFeat);
		};
		
		service.removeFeat = function(card){
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