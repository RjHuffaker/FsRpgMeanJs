'use strict';

// Stack helper-functions
angular.module('move').factory('DeckUtils', ['$rootScope', 'CoreVars', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, PanelUtils, setPanelPosition) {
    
    var service = {};
    
    service.getRefArray = function(cardList){
        var _first = PanelUtils.getFirst(cardList);
        var _index = _first.index;
        var _panel = _first.panel;
        var _refArray = [_index];
        
        if(!_panel){
            console.log(_refArray);
        }
        
        while(_panel.below.adjacent || _panel.below.overlap || _panel.right.adjacent || _panel.right.overlap){
            if(_panel.below.adjacent){
                _index = PanelUtils.getPanelIndex(cardList, _panel.below.adjacent);
            } else if(_panel.below.overlap){
                _index = PanelUtils.getPanelIndex(cardList, _panel.below.overlap);
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
            
            _current.dragging = false;
            _current.locked = false;
            _current.above = { adjacent: null, overlap: null };
            _current.below = { adjacent: null, overlap: null };
            _current.left = { adjacent: null, overlap: null };
            _current.right = { adjacent: null, overlap: null };
            if(_previous) _current.left.adjacent = _previous._id;
            if(_next) _current.right.adjacent = _next._id;
        }
        
        setPanelPosition(cardList);
        
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
        
        var _refArray = service.getRefArray(cardList);
        var _prev = PanelUtils.getPrev(cardList, panel._id);
        var _next = PanelUtils.getNext(cardList, panel._id);
        
        if(PanelUtils.hasAbove(panel)){
            if(PanelUtils.hasBelow(panel)){
                if(panel.above.overlap && panel.below.overlap){
                    PanelUtils.setOverlapVertical(_prev, _next);
                } else {
                    PanelUtils.setAdjacentVertical(_prev, _next);
                }
            } else if(PanelUtils.hasRight(panel)){
                if(panel.right.overlap){
                    PanelUtils.setOverlapHorizontal(_prev, _next);
                } else {
                    PanelUtils.setAdjacentHorizontal(_prev, _next);
                }
            }
        } else if(PanelUtils.hasLeft(panel)){
            if(PanelUtils.hasBelow(panel)){
                if(panel.left.overlap){
                    PanelUtils.setOverlapHorizontal(_prev, _next);
                } else {
                    PanelUtils.setAdjacentHorizontal(_prev, _next);
                }
            } else if(PanelUtils.hasRight(panel)){
                if(panel.left.overlap && panel.right.overlap){
                    PanelUtils.setOverlapHorizontal(_prev, _next);
                } else {
                    PanelUtils.setAdjacentHorizontal(_prev, _next);
                }
            }
        }
        
        setPanelPosition(cardList);
        
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
        var _lastPanel = PanelUtils.getLast(cardList);
        return _lastPanel.x_coord + _lastPanel.x_dim;
    };
    
    service.setDeckWidth = function(cardList){
        var _deckWidth = service.getDeckWidth(cardList);
        $rootScope.$broadcast('DeckUtils:setDeckWidth', {
            deckWidth: _deckWidth
        });
    };
    
    return service;
}]);