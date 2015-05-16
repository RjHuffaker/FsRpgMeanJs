'use strict';

// Stack helper-functions
angular.module('core').factory('CoreStack', ['$rootScope', function($rootScope) {
    
    var service = {};
    
    service.getLastPanel = function(cardList){
        var _index = 0;
        var _panel = { x_coord: 0 };
        if(cardList.length > 0){
            for(var i = 0; i < cardList.length; i++){
                if(cardList[i].x_coord > (_panel.x_coord || -1)){
                    _index = i;
                    _panel = cardList[i];
                }
            }
        }
        return {
            index: _index, panel: _panel
        };  
    };
    
    service.getLowestPanel = function(cardList, x_coord){
        var _index = 0;
        var _panel = { y_coord: 0 };
        if(cardList.length > 0){
            for(var i = 0; i < cardList.length; i++){
                if(cardList[i].x_coord === x_coord){
                    if(cardList[i].y_coord > (_panel.y_coord || -1)){
                        _index = i;
                        _panel = cardList[i];
                    }
                }
            }
        }
        return {
            index: _index, panel: _panel
        };
    };
    
    service.getDeckWidth = function(cardList){
        var lastPanel = service.getLastPanel(cardList);
        return lastPanel.panel.x_coord + 15;
    };
    
    service.setDeckWidth = function(cardList){
        var _deckWidth = service.getDeckWidth(cardList);
        $rootScope.$broadcast('CoreStack:setDeckWidth', {
            deckWidth: _deckWidth
        });
    };
    
    service.setCardList = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            cardList[i].x_coord = i * 15;
            cardList[i].y_coord = 0;
            cardList[i].x_overlap = false;
            cardList[i].y_overlap = false;
            cardList[i].dragging = false;
            cardList[i].stacked = false;
            cardList[i].locked = false;
        }
        $rootScope.$broadcast('DeckOrder:onDeckChange');
    };
    
    service.getColumnArray = function(cardList, x_coord){
        var _column = [];
        for(var i =0; i < cardList.length; i++){
            if(cardList[i].x_coord === x_coord){
                _column.push(i);
            }
        }
        return _column;
    };
    
    service.setColumnStacked = function(cardList, x_coord){
        var _lowest = service.getLowestPanel(cardList, x_coord);
        if(_lowest.panel.y_coord > 0){
            var _column = service.getColumnArray(cardList, x_coord);
            for(var i = 0; i < _column.length; i++){
                cardList[_column[i]].stacked = true;
            }
        } else {
            cardList[_lowest.index].stacked = false;
        }
    };
    
    service.setColumnOverlap = function(cardList, x_coord){
        var _lowest = service.getLowestPanel(cardList, x_coord);
        if(_lowest.panel.y_coord > 0){
            var _column = service.getColumnArray(cardList, x_coord);
            _column.sort(function(a, b){
                return cardList[a].y_coord - cardList[b].y_coord;
            });
            for(var i = 0; i < _column.length; i++){
                if(_column[i] === _lowest.index){
                    cardList[_column[i]].y_overlap = false;
                } else {
                    var _panel = cardList[_column[i]];
                    var _next = cardList[_column[i+1]];
                    if(_next.y_coord - _panel.y_coord === 3){
                        _panel.y_overlap = true;
                    } else if(_next.y_coord - _panel.y_coord === 21){
                        _panel.y_overlap = false;
                    }
                }
            }
        } else {
            cardList[_lowest.index].y_overlap = false;
        }
    };
    
    
    return service;
    
}]);