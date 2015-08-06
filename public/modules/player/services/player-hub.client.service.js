'use strict';

angular.module('player').factory('PlayerHub', ['$rootScope', 'CoreVars', 'Bakery', 'factorDefenses', 'factorStats', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'abilityDice', function($rootScope, CoreVars, Bakery, factorDefenses, factorStats, PcsTraits, PcsFeats, PcsAugments, abilityDice) {
    
    var service = {};
    
    service.chooseDie = function(order){
        abilityDice.chooseDie(Bakery.resource, order);
        switch(abilityDice.chosenAbility.order){
            case 0:
            case 1:
                factorDefenses.factorBlock(Bakery.resource);
                factorStats.factorHealth(Bakery.resource);
                factorStats.factorStamina(Bakery.resource);
                factorStats.factorCarryingCapacity(Bakery.resource);
                break;
            case 2:
            case 3:
                factorDefenses.factorDodge(Bakery.resource);
                break;
            case 4:
            case 5:
                factorDefenses.factorAlertness(Bakery.resource);
                break;
            case 6:
            case 7:
                factorDefenses.factorTenacity(Bakery.resource);
                break;
        }
    };
    
    //Watch for change in EXP input
    service.watchEXP = function(newValue, oldValue){
        if (Bakery.resource.deckType === 'pc' && newValue !== oldValue){
            CoreVars.EXP = parseInt(newValue);
            Bakery.resource.experience = parseInt(newValue);
        }
    };
    
    //Watch for change in experience
    service.watchExperience = function(newValue, oldValue){
        if (Bakery.resource.deckType === 'pc' && newValue !== oldValue){
            factorStats.factorExperience(Bakery.resource);
            if (newValue !== CoreVars.EXP){
                CoreVars.EXP = newValue;
            }
        }
    };
    
    //Watch for changes in level
    service.watchLevel = function(newValue, oldValue){
        if (Bakery.resource.deckType === 'pc'){
            factorStats.factorHealth(Bakery.resource);
            factorStats.factorStamina(Bakery.resource);
            PcsTraits.factorTraitLimit(Bakery.resource);
            PcsFeats.factorFeatLimit(Bakery.resource);
            PcsAugments.factorAugmentLimit(Bakery.resource);
        }
    };
    
    return service;
    
}]);