'use strict';

// Stack helper-functions
angular.module('move').factory('DeckUtils', ['$rootScope', 'PanelUtils', function($rootScope, PanelUtils) {
    
    var service = {};
    
    service.getRefArray = function(cardList){
        var _cardList = [];
        for(var i = 0; i < cardList.length; i++){
            _cardList.push(i);
        }
        
        _cardList.sort(function(a, b){
            var axy = cardList[a].x_coord * 100 + cardList[a].y_coord;
            var bxy = cardList[b].x_coord * 100 + cardList[b].y_coord;
            return (cardList[a].x_coord * 100 + cardList[a].y_coord) - (cardList[b].x_coord * 100 + cardList[b].y_coord);
        });
        
        return _cardList;
    };
    
    service.getRefIndex = function(cardList, panel){
        var _panel = 0;
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i].x_coord === panel.x_coord && cardList[i].y_coord === panel.y_coord){
                _panel = i;
            }
        }
        return _panel;
    };
    
    service.setCardList = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            cardList[i].x_coord = i * 15;
            cardList[i].y_coord = 0;
            cardList[i].x_overlap = false;
            cardList[i].y_overlap = false;
            cardList[i].x_stack = false;
            cardList[i].y_stack = false;
            cardList[i].dragging = false;
            cardList[i].locked = false;
        }
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.expandDeck = function(cardList, panel){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            
            var slotData = PanelUtils.getPanelData(slot);
            if (slot !== panel && slot.x_coord >= panel_x_coord){
                slot.x_coord += 15;
                slotData.cardNumber++;
            }
        }
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.collapseDeck = function(cardList, panel){
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            var slotData = PanelUtils.getPanelData(slot);
            
            if (slot.x_coord > panel.x_coord){
                slot.x_coord -= 15;
                if(slotData) slotData.cardNumber--;
            }
        }
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.setDeckSize = function(resource){
        var _length = resource.cardList.length - 1;
        resource.deckSize = _length;
        for(var i = 0; i < resource.cardList.length; i++){
            var panel = resource.cardList[i];
            var panelData = PanelUtils.getPanelData(panel);
            panelData.deckSize = _length;
        }
    };
    
    service.getDeckWidth = function(cardList){
        var lastPanel = PanelUtils.getLastPanel(cardList);
        return lastPanel.panel.x_coord + 15;
    };
    
    service.setDeckWidth = function(cardList){
        var _deckWidth = service.getDeckWidth(cardList);
        $rootScope.$broadcast('DeckUtils:setDeckWidth', {
            deckWidth: _deckWidth
        });
    };
    
    service.shuffleDeck = function(cardList){
        var _refArray = service.getRefArray(cardList),
            _x_coord = 0,
            _y_coord = 0,
            _x_overlap = false,
            _y_overlap = false,
            _x_stack = false,
            _y_stack = false;
        
        var pushRight = function(){
            _x_coord += 15;
            _y_coord = 0;
            _x_overlap = false;
            _y_overlap = false;
            _x_stack = false;
            _y_stack = false;
        };
        
        var stackRight = function(){
            _x_coord += 3;
            _y_coord = 0;
            _x_overlap = true;
            _y_overlap = false;
            _x_stack = true;
            _y_stack = false;
            _previous.x_stack = true;
        };
        
        var pushUp = function(){
            _y_coord += 21;
            _x_overlap = false;
            _y_overlap = false;
            _x_stack = false;
            _y_stack = true;
        };
        
        var stackUp = function(){
            _y_coord += 3;
            _x_overlap = false;
            _y_stack = true;
            _previous.y_overlap = true;
            _previous.y_stack = true;
        };
        
        _refArray.sort(function() { return 0.5 - Math.random(); });
        
        for(var i = 0; i < _refArray.length; i++){
            var _current = cardList[_refArray[i]];
            var _previous = cardList[_refArray[i - 1]] || null;
            
            if(_previous){
                var _1d4 = Math.floor(Math.random() * 4 + 1);
                switch(_1d4){
                    case 1:
                        if(_previous.x_stack){
                            pushRight();
                        } else if(_previous.y_stack){
                            pushRight();
                        } else {
                            pushRight();
                        }
                        break;
                    case 2:
                        if(_previous.x_stack){
                            stackRight();
                        } else if(_previous.y_stack){
                            pushRight();
                        } else {
                            stackRight();
                        }
                        break;
                    case 3:
                        if(_previous.x_stack){
                            pushRight();
                        } else if(_previous.y_stack){
                            pushUp();
                        } else {
                            pushUp();
                        }
                        break;
                    case 4:
                        if(_previous.x_stack){
                            stackRight();
                        } else if(_previous.y_stack){
                            stackUp();
                        } else {
                            stackUp();
                        }
                        break;
                }
            }
            
            _current.x_coord = _x_coord;
            _current.y_coord = _y_coord;
            _current.x_overlap = _x_overlap;
            _current.y_overlap = _y_overlap;
            _current.x_stack = _x_stack;
            _current.y_stack = _y_stack;
            
        }
        
    };
    
    return service;
}]);