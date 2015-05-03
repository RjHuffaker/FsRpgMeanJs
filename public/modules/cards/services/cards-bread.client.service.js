'use strict';

angular.module('decks').factory('CardsBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery){
    var service = {};
    
    var editDeck = function(deck, _loadDeck) {
        var _deck = new Bakery.Decks(deck);

        _deck.$update(function(response) {
            if(_loadDeck){
                Bakery.resource = response;
            }
        }, function(errorResponse) {
            console.log(errorResponse);
        });
    };
    
    var getCardResource = function(cardType){
        switch(cardType){
            case 'Aspect':
                return Bakery.Aspects;
            case 'Trait':
                return Bakery.Traits;
            case 'Feat':
                return Bakery.Feats;
            case 'Augment':
                return Bakery.Augments;
            case 'Item':
                return Bakery.Items;
            case 'Origin':
                return Bakery.Origins;
        }
    };
    
    var getNewCardResource = function(panel){
        switch(panel.panelType){
            case 'Aspect':
                return new Bakery.Aspects(panel.aspectData);
            case 'Trait':
                return new Bakery.Traits(panel.traitData);
            case 'Feat':
                return new Bakery.Feats(panel.featData);
            case 'Augment':
                return new Bakery.Augments(panel.augmentData);
            case 'Item':
                return new Bakery.Items(panel.itemData);
            case 'Origin':
                return new Bakery.Origins(panel.originData);
        }
    };
    
    var getCardParams = function(panel){
        var cardId;
        console.log(panel);
        switch(panel.panelType){
            case 'Aspect':
                cardId = panel.aspectData._id;
                return { aspectId: cardId };
            case 'Trait':
                cardId = panel.traitData._id;
                return { traitId: cardId };
            case 'Feat':
                cardId = panel.featData._id;
                return { featId: cardId };
            case 'Augment':
                cardId = panel.augmentData._id;
                return { augmentId: cardId };
            case 'Item':
                cardId = panel.itemData._id;
                return { itemId: cardId };
            case 'Origin':
                cardId = panel.originData._id;
                return { originId: cardId };
        }
    };
    
    var getPanelData = function(panel){
        switch(panel.panelType){
            case 'Aspect':
                return panel.aspectData;
            case 'Trait':
                return panel.traitData;
            case 'Feat':
                return panel.featData;
            case 'Augment':
                return panel.augmentData;
            case 'Item':
                return panel.itemData;
            case 'Origin':
                return panel.originData;
            default:
                return false;
        }
    };
    
    var setPanelData = function(panel, cardData){
        switch(panel.panelType){
            case 'Aspect':
                panel.aspectData = cardData;
                break;
            case 'Trait':
                panel.traitData = cardData;
                break;
            case 'Feat':
                panel.featData = cardData;
                break;
            case 'Augment':
                panel.augmentData = cardData;
                break;
            case 'Item':
                panel.itemData = cardData;
                break;
            case 'Origin':
                panel.originData = cardData;
                break;
        }
    };
    
    //BROWSE
    service.browse = function(cardType, params, destination){
        var cardParams = getCardParams(params);
        getCardResource(cardType).query(cardParams, function(response){
            return response;
        });
    };
    
    //READ
    service.read = function(panel){
        var params = getCardParams(panel);
        console.log(params);
        getCardResource(panel.panelType).get(
            params,
        function(response){
            console.log(response);
            setPanelData(panel, response);
        });
    };
    
    //EDIT
    service.edit = function(panel){
        if(panel.panelType === 'Aspect'){
            getNewCardResource(panel).$update();
        } else if(getPanelData(panel)){
            var panelData = getPanelData(panel);
            var cardResource = getNewCardResource(panel);
            if(panelData.aspect) cardResource.aspect = panelData.aspect._id;
            cardResource.$update();
        }
    };
    
    //ADD
    service.add = function(deck, cardType, cardNumber, deckShift, deckSave){
        var card = {
            deck: deck._id,
            cardSet: deck.deckSize,
            cardNumber: cardNumber,
            cardType: cardType
        };

        var panel = {
            panelType: cardType,
            x_coord: cardNumber * 15,
            y_coord: 0
        };
        
        setPanelData(panel, card);
        
        var cardResource = getNewCardResource(panel);
        
        cardResource.$save(function(response){
            setPanelData(panel, response);
            deck.cardList.push(panel);
            Bakery.setDeckSize(Bakery.resource);
        }).then(function(response){
            if(deckShift) Bakery.expandDeck(panel, Bakery.resource.cardList);
        }).then(function(response){
            if(deckSave) editDeck(deck, true);
        });
    };
    
    //DELETE
    service.delete = function(panel, deck){
        if(panel.panelType === 'architectOptions') return;
        
        var cardResource = getNewCardResource(panel);
        cardResource.$remove(function(response){
                if(deck) Bakery.removePanel(panel, deck.cardList);
            }).then(function(response){
                if(deck) Bakery.setDeckSize(deck);
            }).then(function(response){
                if(deck) Bakery.collapseDeck(panel, deck.cardList);
            }).then(function(response){
                if(deck) editDeck(deck, false);
        });
    };
    
    return service;
    
}]);