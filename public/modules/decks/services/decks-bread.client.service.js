'use strict';

angular.module('decks').factory('DecksBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'CoreStack', 'CorePanel', 'CardsBread', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, CoreStack, CorePanel, CardsBread){
    
    var service = {};
    
    var browseAspects = function(deck){
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
    
    var browseDependencies = function(){
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
                    panelType: 'architectOptions'
                });
                Bakery.resource.cardList = response;
                CoreStack.setCardList(Bakery.resource.cardList);
            });
        } else {
            Bakery.Decks.list(function(response){
                response.unshift({
                    panelType: 'architectOptions'
                });
                Bakery.resource.cardList = response;
                CoreStack.setCardList(Bakery.resource.cardList);
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
                
                browseDependencies();

                for(var i = 0; i < response.dependencies.length; i++){
                    browseAspects(response.dependencies[i]);
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
                    browseDependencies();
                }
            });
    };
    
    //DELETE
    service.delete = function(deck, resource){
        deck.$remove(function(response){
            CoreStack.removePanel(resource.cardList, deck);
            Bakery.setDeckSize(resource);
            Bakery.collapseDeck(deck, resource.cardList);
        });
    };
    
    return service;
    
}]);