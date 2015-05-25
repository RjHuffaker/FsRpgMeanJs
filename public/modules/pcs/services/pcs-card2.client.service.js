'use strict';

// Factory-service for managing pc2 data.
angular.module('pcs').factory('PcsCard2', ['$rootScope', 'Bakery', 'PcsTraits',
	function($rootScope, Bakery, PcsTraits){
		var service = {};
		
		service.factorExperience = function(){
			var mLevel = 0;
			var mExperience = Number(Bakery.resource.experience);
			for (var increment = 8; increment <= mExperience; increment++){
				mLevel++;
				mExperience = mExperience - increment;
			}
			Bakery.resource.level = mLevel;
		};
		
		service.factorHealth = function(){
			Bakery.resource.healthLimit = 
				Math.round(
					(Number(Bakery.resource.abilities[0].dice.sides) +
						Number(Bakery.resource.abilities[1].dice.sides)
					) * ((Bakery.resource.level || 0)/16 + 1));
			Bakery.resource.healthCurrent =
				Number(Bakery.resource.healthLimit - Bakery.resource.injury);
		};
		
		service.factorStamina = function(){
			Bakery.resource.staminaLimit = 
				Math.round(
					(Number(Bakery.resource.abilities[0].dice.sides) +
						Number(Bakery.resource.abilities[1].dice.sides)
					) * ((Bakery.resource.level || 0)/16 + 1));
			Bakery.resource.staminaCurrent =
				Number(Bakery.resource.healthLimit - Bakery.resource.injury);
		};
		
		service.factorCarryingCapacity = function(){
			Bakery.resource.carryCurrent = 0;
			Bakery.resource.carryLimit =
				Number(Bakery.resource.abilities[0].dice.sides) +
				Number(Bakery.resource.abilities[1].dice.sides);
		};
		
		return service;
	}]);