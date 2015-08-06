'use strict';

angular.module('cards').factory('CardsBread', ['Bakery', 'PanelUtils', 'DeckUtils',
    function(Bakery, PanelUtils, DeckUtils){
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
            var cardParams = PanelUtils.getCardParams(params);
            Bakery.getCardResource(cardType).query(cardParams, function(response){
                return response;
            });
        };
        
        //READ
        service.read = function(panel, callback){
            var params = PanelUtils.getCardParams(panel);
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
                var panelData = PanelUtils.getPanelData(panel);
                if(panelData.aspect) cardResource.aspect = panelData.aspect._id;
            }
            cardResource.$update();
        };
        
        //ADD
        service.add = function(resource, prevId, cardNumber, callback){
            
            var _prev;
            
            if(prevId){
                _prev = PanelUtils.getPanel(resource.cardList, prevId);
            } else {
                _prev = PanelUtils.getLast(resource.cardList).panel;
            }
            
            console.log('add: _prev._id = '+_prev._id);
            
            var _next = PanelUtils.getNext(resource.cardList, _prev._id).panel;
            
            var card = {
                deck: resource._id,
                deckName: resource.name,
                deckSize: resource.deckSize,
                cardNumber: cardNumber,
                cardType: resource.deckType
            };
            
            var panel = {
                panelType: resource.deckType,
                x_coord: _prev.x_coord + 15,
                y_coord: 0
            };
            
            PanelUtils.setPanelData(panel, card);
            
            var cardResource = Bakery.getNewCardResource(panel);
            
            cardResource.$save(function(response){
                PanelUtils.setPanelData(panel, response);
                resource.cardList.push(panel);
            }).then(function(response){
                if(callback) callback(response);
            });
        };
        
        //DELETE
        service.delete = function(resource, panel){
            if(panel.panelType === 'architectOptions') return;
            
            var cardResource = Bakery.getNewCardResource(panel);
            cardResource.$remove(function(response){
                if(resource) PanelUtils.removePanel(resource.cardList, panel);
            }).then(function(response){
                if(resource) DeckUtils.setDeckSize(resource);
            }).then(function(response){
                if(resource) DeckUtils.collapseDeck(resource.cardList, panel);
            }).then(function(response){
                if(resource) editDeck(resource, false);
            });
        };
        
        return service;
        
    }]);