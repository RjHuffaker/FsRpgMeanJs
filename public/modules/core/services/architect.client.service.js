'use strict';

angular.module('core').factory('Architect', ['$rootScope', 'Bakery', 'DecksBread', function($rootScope, Bakery, DecksBread) {
    
    var service = {};
    
    // Used by card-logo.html and feature-card.html
    service.toggleCardLock = function(panel, cardList){
        for(var i = 0; i < cardList.length; i++){
            if (panel === cardList[i]){
                cardList[i].locked = !cardList[i].locked;
            }
        }
    };
    
    // Used by deck-options.html and 'toggleDependency'
    service.findDependency = function(deck, resource){
        var index = -1;
        for(var i = 0; i < resource.dependencies.length; i++){
            var dependency = resource.dependencies[i];
            if (dependency._id === deck._id){
                index = i;
            }
        }
        return index;
    };

    // Used by core.client.controller
    service.toggleDependency = function(deck, resource){
        var deckIndex = service.findDependency(deck, resource);

        if (deckIndex > -1) {
            resource.dependencies.splice(deckIndex, 1);
        } else {
            resource.dependencies.push(deck);
        }
        
        for(var i = 0; i < resource.dependencies.length; i++){
            DecksBread.browseAspects(resource.dependencies[i]);
        }
    };
    
    // Used by card-header.html
    service.changeAspect = function(card, aspect){
        console.log(card);
        console.log(aspect);
        if (card.aspect !== aspect){
            card.aspect = aspect;
        }
    };
    
    return service;
    
}]);