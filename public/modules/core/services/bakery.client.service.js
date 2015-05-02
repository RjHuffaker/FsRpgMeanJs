'use strict';

// General Bakery Factory-service.
angular.module('core').factory('Bakery', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Decks', 'Pcs', 'Aspects', 'Traits', 'Feats', 'Augments', 'Items', 'Origins', function($stateParams, $location, Authentication, $resource, $rootScope, Decks, Pcs, Aspects, Traits, Feats, Augments, Items, Origins){
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
    
    service.lastPanel = function(cardList){
        if(cardList.length > 0){
            var _index = 0;
            var _panel = { x_coord: 0 };
            for(var i = 0; i < cardList.length; i++){
                if(cardList[i].x_coord > (_panel.x_coord || 0)){
                    _index = i;
                    _panel = cardList[i];
                }
            }
            return {
                index: _index, panel: _panel
            };
        } else {
            return {
                index: 0, panel: { x_coord: 0 }
            };
        }
    };
    
    service.deckWidth = function(cardList){
        var lastPanel = service.lastPanel(cardList);
        return service.lastPanel(cardList).panel.x_coord + 15;
    };
    
    service.setCardList = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            cardList[i].x_coord = i * 15;
            cardList[i].y_coord = 0;
            cardList[i].x_overlap = false;
            cardList[i].y_overlap = false;
            cardList[i].dragging = false;
            cardList[i].stacked = false;
        }
        $rootScope.$broadcast('DeckOrder:onDeckChange');
    };
    
    service.removePanel = function(panel, cardList){
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i] === panel ) {
                cardList.splice(i, 1);
            }
        }
    };
	
    service.shiftDeck = function(panel, expand, cardList){
        var panel_x = panel.x_coord;
        var panel_y = panel.y_coord;
        var x_shift = expand ? 15 : -15;
        var _number = expand ? 1 : -1;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            if(panel_x <= slot.x_coord){
                if(panel_y !== slot.y_coord){
                    slot.x_coord += x_shift;
                    if(slot.aspectData){
                        slot.aspectData.cardNumber += _number;
                    } else if(slot.traitData){
                        slot.traitData.cardNumber += _number;
                    } else if(slot.featData){
                        slot.featData.cardNumber += _number;
                    } else if(slot.augmentData){
                        slot.augmentData.cardNumber += _number;
                    } else if(slot.itemData){
                        slot.itemData.cardNumber += _number;
                    } else if(slot.originData){
                        slot.originData.cardNumber += _number;
                    }
                }
            }
        }

        $rootScope.$broadcast('Bakery:onDeckChange');
    };
    
    service.expandDeck = function(panel, cardList){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            if(slot !== panel && slot.x_coord >= panel_x_coord){
                slot.x_coord += 15;
                if(slot.aspectData){
                    slot.aspectData.cardNumber++;
                } else if(slot.traitData){
                    slot.traitData.cardNumber++;
                } else if(slot.featData){
                    slot.featData.cardNumber++;
                } else if(slot.augmentData){
                    slot.augmentData.cardNumber++;
                } else if(slot.itemData){
                    slot.itemData.cardNumber++;
                } else if(slot.originData){
                    slot.originData.cardNumber++;
                }
            }
        }
        $rootScope.$broadcast('Bakery:onDeckChange');
    };
    
    service.collapseDeck = function(panel, cardList){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            if(slot.x_coord > panel_x_coord){
                slot.x_coord -= 15;
                if(slot.aspectData){
                    slot.aspectData.cardNumber--;
                } else if(slot.traitData){
                    slot.traitData.cardNumber--;
                } else if(slot.featData){
                    slot.featData.cardNumber--;
                } else if(slot.augmentData){
                    slot.augmentData.cardNumber--;
                } else if(slot.itemData){
                    slot.itemData.cardNumber--;
                } else if(slot.originData){
                    slot.originData.cardNumber--;
                }
            }
        }
        $rootScope.$broadcast('Bakery:onDeckChange');
    };
    
    service.setDeckSize = function(resource){
        var _length = resource.cardList.length - 1;
        resource.deckSize = _length;
        for(var i = 0; i < resource.cardList.length; i++){
            var panel = resource.cardList[i];
            if(panel.aspectData){
                panel.aspectData.cardSet = _length;
            } else if(panel.traitData){
                panel.traitData.cardSet = _length;
            } else if(panel.featData){
                panel.featData.cardSet = _length;
            } else if(panel.augmentData){
                panel.augmentData.cardSet = _length;
            } else if(panel.itemData){
                panel.itemData.cardSet = _length;
            } else if(panel.originData){
                panel.originData.cardSet = _length;
            }
        }
    };
    
    service.toggleCardLock = function(panel){
        for(var i = 0; i < service.resource.cardList.length; i++){
            if(panel === service.resource.cardList[i]){
                service.resource.cardList[i].locked = !service.resource.cardList[i].locked;
            }
        }
    };
    
    service.findDependency = function(deck){
        var index = -1;
        for(var i = 0; i < service.resource.dependencies.length; i++){
            var dependency = service.resource.dependencies[i];
            if(dependency._id === deck._id){
                index = i;
            }
        }
        return index;
    };

    service.toggleDependency = function(deck){
        var deckIndex = service.findDependency(deck);

        if (deckIndex > -1) {
            service.resource.dependencies.splice(deckIndex, 1);
        } else {
            service.resource.dependencies.push(deck);
        }
    };
    
    service.changeAspect = function(card, aspect){
        if(card.aspect === aspect){
            console.log('same');
        } else {
            card.aspect = aspect;
        }
    };
    
    return service;
}]);