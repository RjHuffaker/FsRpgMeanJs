'use strict';

// Factory-service for managing pc2 data.
angular.module('player').factory('PcsCard2', ['$rootScope', 'Pcs',
	function($rootScope, Pcs){
		var service = {};
		
		service.EXP = 0;
		
		if(Pcs.pc){
			service.EXP = Pcs.pc.experience;
		}
		
		service.factorExperience = function(){
			var mLevel = 0;
			var mExperience = Number(Pcs.pc.experience);
			for (var increment = 8; increment <= mExperience; increment++){
				mLevel++;
				mExperience = mExperience - increment;
			}
			Pcs.pc.level = mLevel;
		};
		
		service.factorHealth = function(){
			Pcs.pc.healthLimit = 
				Math.round(
					(Number(Pcs.pc.abilities[0].dice.sides) +
						Number(Pcs.pc.abilities[1].dice.sides)
					) * ((Pcs.pc.level || 0)/16 + 1));
			Pcs.pc.healthCurrent =
				Number(Pcs.pc.healthLimit - Pcs.pc.injury);
		};
		
		service.factorStamina = function(){
			Pcs.pc.staminaLimit = 
				Math.round(
					(Number(Pcs.pc.abilities[0].dice.sides) +
						Number(Pcs.pc.abilities[1].dice.sides)
					) * ((Pcs.pc.level || 0)/16 + 1));
			Pcs.pc.staminaCurrent =
				Number(Pcs.pc.healthLimit - Pcs.pc.injury);
		};
		
		service.factorCarryingCapacity = function(){
			Pcs.pc.carryCurrent = 0;
			Pcs.pc.carryLimit =
				Number(Pcs.pc.abilities[0].dice.sides) +
				Number(Pcs.pc.abilities[1].dice.sides);
		};
		
		return service;
	}]);