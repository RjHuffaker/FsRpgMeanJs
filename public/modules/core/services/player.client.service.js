'use strict';

angular.module('core').factory('Player', ['$rootScope', 'CoreVars', 'Bakery', 'PcsCard1', 'PcsCard2', 'PcsTraits', 'PcsFeats', 'PcsAugments', function($rootScope, CoreVars, Bakery, PcsCard1, PcsCard2, PcsTraits, PcsFeats, PcsAugments) {
    
    var service = {};
    
    service.updateAbility = function(event, object){
        console.log('updateAbility');
        console.log(object);
        
        var abilityPair = object.abilityPair;
        var ability1 = object.ability1;
        var ability2 = object.ability2;
        switch(abilityPair){
            case 1:
                PcsCard1.factorBlock(ability1, ability2);
                PcsCard2.factorHealth();
                PcsCard2.factorStamina();
                PcsCard2.factorCarryingCapacity();
                break;
            case 2:
                PcsCard1.factorDodge(ability1, ability2);
                break;
            case 3:
                PcsCard1.factorAlertness(ability1, ability2);
                break;
            case 4:
                PcsCard1.factorTenacity(ability1, ability2);
                break;
        }
    };
    
    service.chooseAbility = function(event, object){
        CoreVars.modalShown = true;
        CoreVars.diceBoxShown = true;
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
            PcsCard2.factorExperience();
            if (newValue !== PcsCard2.EXP){
                CoreVars.EXP = newValue;
            }
        }
    };
    
    //Watch for changes in level
    service.watchLevel = function(newValue, oldValue){
        if (Bakery.resource.deckType === 'pc'){
            PcsCard2.factorHealth();
            PcsCard2.factorStamina();
            PcsTraits.factorTraitLimit();
            PcsFeats.factorFeatLimit();
            PcsAugments.factorAugmentLimit();
        }
    };
    
    return service;
    
}]);