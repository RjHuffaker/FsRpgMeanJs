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
    
    return service;
}]);