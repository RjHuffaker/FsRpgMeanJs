'use strict';

// General BREAD Factory-service.
angular.module('core').factory('Bakery', ['Decks', 'StackUtils', 'PanelUtils', 'demoDeck', 'Pcs', 'Aspects', 'Traits', 'Feats', 'Augments', 'Items', 'Origins', 'Notes', function(Decks, StackUtils, PanelUtils, demoDeck, Pcs, Aspects, Traits, Feats, Augments, Items, Origins, Notes){
	var service = {};
    
    service.Decks = Decks;
    
    service.Pcs = Pcs;
    
    service.Aspects = Aspects;
    
    service.Traits = Traits;
    
    service.Feats = Feats;
    
    service.Augments = Augments;
    
    service.Items = Items;
    
    service.Origins = Origins;
    
    service.Notes = Notes;
    
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
            case 'Note':
                return service.Notes;
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
            case 'Note':
                return new service.Origins(panel.noteData);
            default:
                return false;
        }
    };
    
    return service;
}]);