'use strict';

// Stack helper-functions
angular.module('move').factory('DeckUtils', ['$rootScope', 'PanelUtils', function($rootScope, PanelUtils) {
    
    var service = {};
    
    service.getRefArray = function(cardList){
        var _index = PanelUtils.getFirst(cardList).index;
        var _panel = cardList[_index];
        var _refArray = [_index];
        
        while(_panel.above.adjacent || _panel.above.overlap || _panel.right.adjacent || _panel.right.overlap){
            if(_panel.above.adjacent){
                _index = PanelUtils.getPanelIndex(cardList, _panel.above.adjacent);
            } else if(_panel.above.overlap){
                _index = PanelUtils.getPanelIndex(cardList, _panel.above.overlap);
            } else if(_panel.right.adjacent){
                _index = PanelUtils.getPanelIndex(cardList, _panel.right.adjacent);
            } else if(_panel.right.overlap){
                _index = PanelUtils.getPanelIndex(cardList, _panel.right.overlap);
            }
            _refArray.push(_index);
            _panel = cardList[_index];
        }
        
        return _refArray;
    };
    
    service.setCardList = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            var _previous = cardList[i-1] || null;
            var _current = cardList[i];
            var _next = cardList[i+1] || null;
            
            _current.x_coord = i * 15;
            _current.y_coord = 0;
            _current.dragging = false;
            _current.locked = false;
            _current.above = { adjacent: null, overlap: null };
            _current.below = { adjacent: null, overlap: null };
            _current.left = { adjacent: null, overlap: null };
            _current.right = { adjacent: null, overlap: null };
            if(_previous) _current.left.adjacent = _previous._id;
            if(_next) _current.right.adjacent = _next._id;
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
        var lastPanel = PanelUtils.getLast(cardList);
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