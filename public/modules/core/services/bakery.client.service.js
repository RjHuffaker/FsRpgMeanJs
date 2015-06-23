'use strict';

// General BREAD Factory-service.
angular.module('core').factory('Bakery', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Decks', 'StackUtils', 'PanelUtils', 'demoDeck', 'Pcs', 'Aspects', 'Traits', 'Feats', 'Augments', 'Items', 'Origins', function($stateParams, $location, Authentication, $resource, $rootScope, Decks, StackUtils, PanelUtils, demoDeck, Pcs, Aspects, Traits, Feats, Augments, Items, Origins){
	var service = {};
    
    service.Decks = Decks;
    
    service.Pcs = Pcs;
    
    service.Aspects = Aspects;
    
    service.Traits = Traits;
    
    service.Feats = Feats;
    
    service.Augments = Augments;
    
    service.Items = Items;
    
    service.Origins = Origins;
    
    service.resource = demoDeck;
    
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
    
    return service;
}]);