'use strict';

angular.module('player').factory('abilityDice', ['$rootScope', 'CoreVars', 'Bakery', function($rootScope, CoreVars, Bakery) {
    var service = {};
    
    service.chosenAbility = {};
    var chosenDie = {};
    var previousDie = {};
    
    
    service.chooseAbility = function(ability){
        console.log(ability);
        CoreVars.modalShown = true;
        CoreVars.diceBoxShown = true;
        service.chosenAbility = ability;
    };
    
    service.chooseDie = function(resource, order){
        CoreVars.modalShown = false;
        CoreVars.diceBoxShown = false;
        
        chosenDie = resource.dicepool[order];
        
        previousDie = service.chosenAbility.dice;
        
        resource.dicepool[order] = resource.dicepool[0];
        
        if(previousDie.order > 0){
            resource.dicepool[previousDie.order] = previousDie;
        }
        
        resource.abilities[service.chosenAbility.order].dice = chosenDie;
    };
    
    return service;
}]);