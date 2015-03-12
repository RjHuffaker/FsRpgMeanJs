'use strict';

// Factory-service for managing pc2 data.
angular.module('pcs').factory('PcsCard2', ['$rootScope', 'BREAD', 'PcsTraits',
	function($rootScope, BREAD, PcsTraits){
		var service = {};
		
		service.EXP = 0;
		
		if(BREAD.resource){
			service.EXP = BREAD.resource.experience;
		}
		
		service.factorExperience = function(){
			var mLevel = 0;
			var mExperience = Number(BREAD.resource.experience);
			for (var increment = 8; increment <= mExperience; increment++){
				mLevel++;
				mExperience = mExperience - increment;
			}
			BREAD.resource.level = mLevel;
		};
		
		service.factorHealth = function(){
			BREAD.resource.healthLimit = 
				Math.round(
					(Number(BREAD.resource.abilities[0].dice.sides) +
						Number(BREAD.resource.abilities[1].dice.sides)
					) * ((BREAD.resource.level || 0)/16 + 1));
			BREAD.resource.healthCurrent =
				Number(BREAD.resource.healthLimit - BREAD.resource.injury);
		};
		
		service.factorStamina = function(){
			BREAD.resource.staminaLimit = 
				Math.round(
					(Number(BREAD.resource.abilities[0].dice.sides) +
						Number(BREAD.resource.abilities[1].dice.sides)
					) * ((BREAD.resource.level || 0)/16 + 1));
			BREAD.resource.staminaCurrent =
				Number(BREAD.resource.healthLimit - BREAD.resource.injury);
		};
		
		service.factorCarryingCapacity = function(){
			BREAD.resource.carryCurrent = 0;
			BREAD.resource.carryLimit =
				Number(BREAD.resource.abilities[0].dice.sides) +
				Number(BREAD.resource.abilities[1].dice.sides);
		};
		
		return service;
	}]);