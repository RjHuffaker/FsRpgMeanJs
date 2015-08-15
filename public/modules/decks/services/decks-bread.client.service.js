'use strict';

angular.module('decks').factory('DecksBread', ['$rootScope', 'syncLoop', 'Bakery', 'PanelUtils', 'DeckUtils', 'CardsBread', 
    function($rootScope, syncLoop, Bakery, PanelUtils, DeckUtils, CardsBread){
        
        var service = {};
        
        service.browseAspects = function(deck){
            Bakery.resource.archetypeList = [];
            Bakery.resource.allegianceList = [];
            Bakery.resource.raceList = [];
            Bakery.Aspects.query({deckId: deck._id}, function(response){
                for(var i = 0; i < response.length; i++){
                    if(response[i].aspectType === 'Archetype'){
                        Bakery.resource.archetypeList.push(response[i]);
                    } else if(response[i].aspectType === 'Allegiance'){
                        Bakery.resource.allegianceList.push(response[i]);
                    } else if(response[i].aspectType === 'Race'){
                        Bakery.resource.raceList.push(response[i]);
                    }
                }
            });
        };
        
        service.browseDependencies = function(){
            Bakery.Decks.query({deckType: 'Aspect'}, function(response){
                Bakery.dependencyDecks = response;
            });
        };
        
        //BROWSE
        service.browse = function(param){
            Bakery.resource = {};
            if(param){
                Bakery.Decks.query(param, function(response){
                    response.unshift({
                        _id: 'builderOptionsId',
                        panelType: 'builderOptions',
                        x_dim: 15,
                        y_dim: 21
                    });
                    Bakery.resource.cardList = response;
                    DeckUtils.setCardList(Bakery.resource.cardList);
                });
            } else {
                Bakery.Decks.list(function(response){
                    response.unshift({
                        _id: 'builderOptionsId',
                        panelType: 'builderOptions',
                        x_dim: 15,
                        y_dim: 21
                    });
                    Bakery.resource.cardList = response;
                    DeckUtils.setCardList(Bakery.resource.cardList);
                });
            }
        };
        
        //READ
        service.read = function(deck){
            Bakery.Decks.get({
                deckId: deck._id
            }, function(response){
                Bakery.resource = response;
                if(response.deckType !== 'Aspect'){
                    service.browseDependencies();
                    for(var i = 0; i < response.dependencies.length; i++){
                        service.browseAspects(response.dependencies[i]);
                    }
                }
                console.log(response);
            });
        };
        
        //EDIT
        service.edit = function(deck, editCards, loadDeck) {
            var _deck = new Bakery.Decks(deck);
            
            _deck.$update(function(response) {
                if(editCards){
                    for(var i = 0; i < deck.cardList.length; i++){
                        var panel = deck.cardList[i];
                        CardsBread.edit(panel);
                    }
                    $rootScope.$broadcast('Bakery: deckSaved');
                }
                if(loadDeck){
                    Bakery.resource = response;
                }
            }, function(errorResponse) {
                console.log(errorResponse);
            });
        };
        
        //ADD
        service.add = function(type, size){
            var deck = new Bakery.Decks ({
                name: type+' Deck',
                deckType: type,
                deckSize: size,
                cardList: [{
                    panelType: 'deckOptions',
                    x_coord: 0,
                    y_coord: 0,
                    x_dim: 15,
                    y_dim: 21,
                    above: { adjacent: null, overlap: null },
                    below: { adjacent: null, overlap: null },
                    left: { adjacent: null, overlap: null },
                    right: { adjacent: null, overlap: null }
                }]
            });
            
            deck.$save(
                function(){
                    var cardNumber = 1;
                    syncLoop(size, function(loop){  
                        CardsBread.add(deck, null, cardNumber, function(response){
                            deck.$update(function(){
                                var previous = deck.cardList[cardNumber-1];
                                var current = deck.cardList[cardNumber];
                                previous.right.adjacent = current._id;
                                current.left.adjacent = previous._id;
                                cardNumber++;
                                loop.next();
                            });
                        });
                    }, function(){
                        service.edit(deck, false, true);
                        if(type !== 'Aspect'){
                            service.browseDependencies();
                        }
                    });
                });
        };
        
        //DELETE
        service.delete = function(resource, deck){
            
            if(resource) DeckUtils.collapseDeck(resource.cardList, deck);
            
            deck.$remove(function(response){
                if(resource) PanelUtils.removePanel(resource.cardList, deck);
            }).then(function(response){
                if(resource) DeckUtils.setDeckSize(resource);
            }).then(function(response){
                // if(resource) DeckUtils.collapseDeck(resource.cardList, deck);
            });
            
        };
        
        return service;
        
    }]);