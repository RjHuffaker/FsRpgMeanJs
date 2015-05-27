'use strict';

angular.module('cards').factory('CardsBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'MoveStack', 'MovePanel', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, MoveStack, MovePanel){
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
    
    //BROWSE
    service.browse = function(cardType, params, destination){
        var cardParams = MovePanel.getCardParams(params);
        Bakery.getCardResource(cardType).query(cardParams, function(response){
            return response;
        });
    };
    
    //READ
    service.read = function(panel, callback){
        var params = MovePanel.getCardParams(panel);
        Bakery.getCardResource(panel.panelType).get(
            params,
        function(response){
            callback(panel, response);
        });
    };
    
    //EDIT
    service.edit = function(panel){
        var cardResource = Bakery.getNewCardResource(panel);
        if(panel.panelType !== 'Aspect'){
            var panelData = MovePanel.getPanelData(panel);
            if(panelData.aspect) cardResource.aspect = panelData.aspect._id;
        }
        cardResource.$update();
    };
    
    //ADD
    service.add = function(deck, cardType, cardNumber, deckShift, deckSave){
        var card = {
            deck: deck._id,
            deckSize: deck.deckSize,
            deckName: deck.name,
            cardNumber: cardNumber,
            cardType: cardType
        };

        var panel = {
            panelType: cardType,
            x_coord: cardNumber * 15,
            y_coord: 0
        };
        
        MovePanel.setPanelData(panel, card);
        
        var cardResource = Bakery.getNewCardResource(panel);
        
        cardResource.$save(function(response){
            MovePanel.setPanelData(panel, response);
            deck.cardList.push(panel);
            MovePanel.setDeckSize(Bakery.resource);
        }).then(function(response){
            if(deckShift) MovePanel.expandDeck(panel, Bakery.resource.cardList);
        }).then(function(response){
            if(deckSave) editDeck(deck, true);
        });
    };
    
    //DELETE
    service.delete = function(panel, deck){
        if(panel.panelType === 'architectOptions') return;
        
        var cardResource = Bakery.getNewCardResource(panel);
        cardResource.$remove(function(response){
                if(deck) MovePanel.removePanel(deck.cardList, panel);
            }).then(function(response){
                if(deck) MovePanel.setDeckSize(deck);
            }).then(function(response){
                if(deck) MovePanel.collapseDeck(panel, deck.cardList);
            }).then(function(response){
                if(deck) editDeck(deck, false);
        });
    };
    
    return service;
    
}]);