'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for managing pc2 data.
pcsModule.factory('PcsCard2', ['$rootScope', 'Pcs',
	function($rootScope, Pcs){
		var service = {};
		
		service.EXP = 0;
		
		service.factorExperience = function(){
			var mLevel = 0;
			var mExperience = Number(Pcs.pc.cards[1].experience);
			for (var increment = 8; increment <= mExperience; increment++){
				mLevel++;
				mExperience = mExperience - increment;
			}
			Pcs.pc.cards[1].level = mLevel;
		};
		
		service.factorHealth = function(){
			Pcs.pc.cards[1].healthLimit = 
				Math.round(
					(Number(Pcs.pc.cards[0].abilities[0].dice.sides) +
						Number(Pcs.pc.cards[0].abilities[1].dice.sides)
					) * ((Pcs.pc.cards[1].level || 0)/16 + 1));
			Pcs.pc.cards[1].healthCurrent =
				Number(Pcs.pc.cards[1].healthLimit - Pcs.pc.cards[1].injury);
		};
		
		service.factorStamina = function(){
			Pcs.pc.cards[1].staminaLimit = 
				Math.round(
					(Number(Pcs.pc.cards[0].abilities[0].dice.sides) +
						Number(Pcs.pc.cards[0].abilities[1].dice.sides)
					) * ((Pcs.pc.cards[1].level || 0)/16 + 1));
			Pcs.pc.cards[1].staminaCurrent =
				Number(Pcs.pc.cards[1].healthLimit - Pcs.pc.cards[1].injury);
		};
		
		service.factorCarryingCapacity = function(){
			Pcs.pc.cards[1].carryCurrent = 0;
			Pcs.pc.cards[1].carryLimit =
				Number(Pcs.pc.cards[0].abilities[0].dice.sides) +
				Number(Pcs.pc.cards[0].abilities[1].dice.sides);
		};
		
		return service;
	}]);