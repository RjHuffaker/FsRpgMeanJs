'use strict';

// General BREAD Factory-service.
angular.module('core').factory('Bakery', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Decks', 'CoreStack', 'CorePanel', 'Pcs', 'Aspects', 'Traits', 'Feats', 'Augments', 'Items', 'Origins', function($stateParams, $location, Authentication, $resource, $rootScope, Decks, CoreStack, CorePanel, Pcs, Aspects, Traits, Feats, Augments, Items, Origins){
	var service = {};
    
    service.Decks = Decks;
    
    service.Pcs = Pcs;
    
    service.Aspects = Aspects;
    
    service.Traits = Traits;
    
    service.Feats = Feats;
    
    service.Augments = Augments;
    
    service.Items = Items;
    
    service.Origins = Origins;
    
    service.resource = {
		cardList: []
	};
    
    service.getCardResource = function(cardType){
        switch(cardType){
            case 'Aspect':
                return service.Aspects;
            case 'Trait':
                return service.Traits;
            case 'Feat':
                return service.Feats;
            case 'Augment':
                return service.Augments;
            case 'Item':
                return service.Items;
            case 'Origin':
                return service.Origins;
            default:
                return false;
        }
    };
    
    service.getNewCardResource = function(panel){
        switch(panel.panelType){
            case 'Aspect':
                return new service.Aspects(panel.aspectData);
            case 'Trait':
                return new service.Traits(panel.traitData);
            case 'Feat':
                return new service.Feats(panel.featData);
            case 'Augment':
                return new service.Augments(panel.augmentData);
            case 'Item':
                return new service.Items(panel.itemData);
            case 'Origin':
                return new service.Origins(panel.originData);
            default:
                return false;
        }
    };
    
    
    
    
    service.expandDeck = function(panel, cardList){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            
            var slotData = CorePanel.getPanelData(slot);
            if(slot !== panel && slot.x_coord >= panel_x_coord){
                slot.x_coord += 15;
                slotData.cardNumber++;
            }
        }
        $rootScope.$broadcast('Bakery:onDeckChange');
    };
    
    service.collapseDeck = function(panel, cardList){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            var slotData = CorePanel.getPanelData(slot);
            if(slot.x_coord > panel_x_coord){
                slot.x_coord -= 15;
                slotData.cardNumber--;
            }
        }
        $rootScope.$broadcast('Bakery:onDeckChange');
    };
    
    service.setDeckSize = function(resource){
        var _length = resource.cardList.length - 1;
        resource.deckSize = _length;
        for(var i = 0; i < resource.cardList.length; i++){
            var panel = resource.cardList[i];
            var panelData = CorePanel.getPanelData(panel);
            panelData.deckSize = _length;
        }
    };
    
    service.toggleCardLock = function(panel, cardList){
        for(var i = 0; i < cardList.length; i++){
            if(panel === cardList[i]){
                cardList[i].locked = !cardList[i].locked;
            }
        }
    };
    
    service.findDependency = function(deck, resource){
        var index = -1;
        for(var i = 0; i < resource.dependencies.length; i++){
            var dependency = resource.dependencies[i];
            if(dependency._id === deck._id){
                index = i;
            }
        }
        return index;
    };

    service.toggleDependency = function(deck, resource){
        var deckIndex = service.findDependency(deck, resource);

        if (deckIndex > -1) {
            resource.dependencies.splice(deckIndex, 1);
        } else {
            resource.dependencies.push(deck);
        }
    };
    
    service.changeAspect = function(card, aspect){
        if(card.aspect !== aspect){
            card.aspect = aspect;
        }
    };
    
    return service;
}]);