'use strict';

// Factory-service for managing pc1 data.
angular.module('player').factory('factorStats', ['CoreVars',
    function(CoreVars){
        
        var service = {};
        
        service.factorExperience = function(resource){
            var mLevel = 0;
            var mExperience = Number(resource.experience);
            for (var increment = 8; increment <= mExperience; increment++){
                mLevel++;
                mExperience = mExperience - increment;
            }
            resource.level = mLevel;
        };
        
        service.factorHealth = function(resource){
            resource.healthLimit = 
                Math.round(
                    (Number(resource.abilities[0].dice.sides) +
                        Number(resource.abilities[1].dice.sides)
                    ) * ((resource.level || 0)/16 + 1));
            resource.healthCurrent =
                Number(resource.healthLimit - resource.injury);
        };
        
        service.factorStamina = function(resource){
            resource.staminaLimit = 
                Math.round(
                    (Number(resource.abilities[0].dice.sides) +
                        Number(resource.abilities[1].dice.sides)
                    ) * ((resource.level || 0)/16 + 1));
            resource.staminaCurrent =
                Number(resource.healthLimit - resource.injury);
        };
        
        service.factorCarryingCapacity = function(resource){
            resource.carryCurrent = 0;
            resource.carryLimit =
                Number(resource.abilities[0].dice.sides) +
                Number(resource.abilities[1].dice.sides);
        };
        
        return service;
    }]);