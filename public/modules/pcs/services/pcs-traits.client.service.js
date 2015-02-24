'use strict';

// Factory-service for managing PC traits
angular.module('pcs')
	.factory('PcsTraits', ['$resource', 'Pcs', 'CardDeck', 
			function($resource, Pcs, CardDeck){
		
		var service = {};
		
		var Traits = $resource(
			'traits/:traitId',
			{ traitId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		// Factor Trait Limit
		service.factorTraitLimit = function(){
			Pcs.pc.traitLimit = Math.floor((Pcs.pc.level || 0) / 4 + 1);
			this.validateTraits();
		};
		
		service.validateTraits = function(){
			for(var ia = 0; ia < Pcs.pc.traitLimit; ia++){
				if(!this.traitAtLevel(ia * 4)){
					this.addTrait(ia * 4);
				}
			}
			for(var ic = 0; ic < Pcs.pc.cardList.length; ic++){
				if(Pcs.pc.cardList[ic].level > Pcs.pc.level){
					CardDeck.removeCard(ic);
				}
			}
		};
		
		service.traitAtLevel = function(level){
			var traitAtLevel = false;
			for(var ib = 0; ib < Pcs.pc.cardList.length; ib++){
				if(Pcs.pc.cardList[ib].cardType === 'trait'){
					if(Pcs.pc.cardList[ib].level === level){
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
				x_coord: Pcs.pc.cardList[Pcs.lastCard()].x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level
			};
			Pcs.pc.cardList.push(newTrait);
		};
		
		service.lockCard = function(card){
			card.cardRole = 'player';
			card.locked = true;
			card.x_coord = (card.cardNumber - 1) * 15;
			card.y_coord = 0;
			card.dragging = false;
			card.stacked = false;
		};
		
		service.setCardList = function(){
			for(var i = 0; i < Pcs.modalCardList.length; i++){
				service.lockCard(Pcs.modalCardList[i]);
			}
		};
		
		service.browseCards = function(){
			Pcs.modalCardList = Traits.query(
				function(response){
					service.setCardList();
				}
			);
		};
		
		return service;
	}]);