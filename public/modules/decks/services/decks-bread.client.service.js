'use strict';

angular.module('decks').factory('DecksBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'PanelUtils', 'DeckUtils', 'StackUtils', 'CardsBread', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, PanelUtils, DeckUtils, StackUtils, CardsBread){
    
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
                    panelType: 'builderOptions'
                });
                Bakery.resource.cardList = response;
                DeckUtils.setCardList(Bakery.resource.cardList);
            });
        } else {
            Bakery.Decks.list(function(response){
                response.unshift({
                    _id: 'builderOptionsId',
                    panelType: 'builderOptions'
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
        });
    };
    
    //EDIT
    service.edit = function(deck, _editCards, _loadDeck) {
        var _deck = new Bakery.Decks(deck);

        _deck.$update(function(response) {
            if(_editCards){
                for(var i = 0; i < deck.cardList.length; i++){
                    var panel = deck.cardList[i];
                    CardsBread.edit(panel);
                }
                $rootScope.$broadcast('Bakery: deckSaved');
            }
            if(_loadDeck){
                service.resource = response;
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
                _id: 'deckOptionsId',
                panelType: 'deckOptions',
                x_coord: 0,
                y_coord: 0
            }]
        });

        deck.$save(
            function(response){
                for(var i = 0; i < size; i++){
                    CardsBread.add(deck, type, i+1, false, (i+1 === size));
                }
                if(type !== 'Aspect'){
                    service.browseDependencies();
                }
            });
    };
    
    //DELETE
    service.delete = function(resource, deck){
        var _deck_x = deck.x_coord;
        var _deck_y = deck.y_coord;
        deck.$remove(function(response){
            if(resource) PanelUtils.removePanel(resource.cardList, deck);
        }).then(function(response){
            if(resource) DeckUtils.setDeckSize(resource);
        }).then(function(response){
            if(resource) DeckUtils.collapseDeck(resource.cardList, { x_coord: _deck_x, y_coord: _deck_y });
        });
        
    };
    
    return service;
    
}]);