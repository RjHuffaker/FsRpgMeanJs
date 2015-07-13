'use strict';

// Panel helper-functions
angular.module('move').factory('PanelUtils', ['$rootScope', '$resource', function($rootScope, $resource) {
    
    var service = {};
    
    service.getPanel = function(cardList, panelId){
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i]._id === panelId){
                return cardList[i];
            }
        }
    };
    
    service.getPanelIndex = function(cardList, panelId){
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i]._id === panelId){
                return i;
            }
        }
    };
    
    service.getPanelOrder = function(cardList, panelId){
        var _order = 0;
        var _index = service.getFirstIndex(cardList);
        var _panel = cardList[_index];
        while((_panel.above.adjacent || _panel.above.overlap || _panel.right.adjacent || _panel.right.overlap)&& _panel._id !== panelId){
            if(_panel.above.adjacent){
                _index = service.getPanelIndex(cardList, _panel.above.adjacent);
            } else if(_panel.above.overlap){
                _index = service.getPanelIndex(cardList, _panel.above.overlap);
            } else if(_panel.right.adjacent){
                _index = service.getPanelIndex(cardList, _panel.right.adjacent);
            } else if(_panel.right.overlap){
                _index = service.getPanelIndex(cardList, _panel.right.overlap);
            }
            _panel = cardList[_index];
            _order++;
        }
        return _order;
    };
    
    service.getRootPanel = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        while(_panel.below.overlap || _panel.left.overlap){
            if(_panel.left.overlap){
                _panel = service.getPanel(cardList, _panel.left.overlap);
            } else if (_panel.below.overlap){
                _panel = service.getPanel(cardList, _panel.below.overlap);
            }
        }
        return _panel;
    };
    
    service.getFirstIndex = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i].x_coord === 0 && cardList[i].y_coord === 0){
                return i;
            }
        }
    };
    
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
    
    service.removePanel = function(cardList, panel){
        for(var i = 0; i < cardList.length; i++){
            if (cardList[i] === panel ) {
                cardList.splice(i, 1);
            }
        }
    };
    
    service.getPanelData = function(panel){
        switch(panel.panelType){
            case 'Aspect':
                return panel.aspectData;
            case 'Trait':
                return panel.traitData;
            case 'Feat':
                return panel.featData;
            case 'Augment':
                return panel.augmentData;
            case 'Item':
                return panel.itemData;
            case 'Origin':
                return panel.originData;
            default:
                return false;
        }
    };
    
    service.setPanelData = function(panel, cardData){
        switch(panel.panelType){
            case 'Aspect':
                panel.aspectData = cardData;
                break;
            case 'Trait':
                panel.traitData = cardData;
                break;
            case 'Feat':
                panel.featData = cardData;
                break;
            case 'Augment':
                panel.augmentData = cardData;
                break;
            case 'Item':
                panel.itemData = cardData;
                break;
            case 'Origin':
                panel.originData = cardData;
                break;
            default:
                return false;
        }
    };
    
    service.getCardParams = function(panel){
        var cardId;
        switch(panel.panelType){
            case 'Aspect':
                cardId = panel.aspectData._id;
                return { aspectId: panel.aspectData._id };
            case 'Trait':
                cardId = panel.traitData._id;
                return { traitId: panel.traitData._id };
            case 'Feat':
                cardId = panel.featData._id;
                return { featId: panel.featData._id };
            case 'Augment':
                cardId = panel.augmentData._id;
                return { augmentId: panel.augmentData._id };
            case 'Item':
                cardId = panel.itemData._id;
                return { itemId: panel.itemData._id };
            case 'Origin':
                cardId = panel.originData._id;
                return { originId: panel.originData._id };
            default:
                return false;
        }
    };
    
    return service;
}]);