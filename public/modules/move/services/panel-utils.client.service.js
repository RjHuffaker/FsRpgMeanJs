'use strict';

// Panel helper-functions
angular.module('move').factory('PanelUtils', ['$rootScope', '$resource', 'CoreVars', function($rootScope, $resource, CoreVars){
    
    var service = {};
    
    service.hasAbove = function(panel){
        if(panel.above.adjacent || panel.above.overlap){
            return true;
        } else {
            return false;
        }
    };
    
    service.hasBelow = function(panel){
        if(panel.below.adjacent || panel.below.overlap){
            return true;
        } else {
            return false;
        }
    };
    
    service.hasLeft = function(panel){
        if(panel.left.adjacent || panel.left.overlap){
            return true;
        } else {
            return false;
        }
    };
    
    service.hasRight = function(panel){
        if(panel.right.adjacent || panel.right.overlap){
            return true;
        } else {
            return false;
        }
    };
    
    service.hasPrev = function(panel){
        if(service.hasAbove(panel) || service.hasLeft(panel)){
            return true;
        } else {
            return false;
        }
    };
    
    service.hasNext = function(panel){
        if(service.hasBelow(panel) || service.hasRight(panel)){
            return true;
        } else {
            return false;
        }
    };
    
    service.isInCluster = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _prev = null;
        var _next = null;
        var _inRange = false;
        var _inStack = false;
        var _length = cardList.length;
        var _prevCount = 0;
        var _nextCount = 0;
        if(_panel.above.overlap){
            _prev = service.getPanel(cardList, _panel.above.overlap);
            _inStack = true;
        } else if(_panel.left.overlap){
            _prev = service.getPanel(cardList, _panel.left.overlap);
            _inRange = true;
        }
        
        if(_panel.below.overlap){
            _next = service.getPanel(cardList, _panel.below.overlap);
            _inStack = true;
        } else if(_panel.right.overlap){
            _next = service.getPanel(cardList, _panel.right.overlap);
            _inRange = true;
        }
        
        if(_prev){
            while((_prev.above.overlap || _prev.left.overlap) && _prevCount < _length){
                if(_prev.above.overlap){
                    _prev = service.getPanel(cardList, _prev.above.overlap);
                    _inStack = true;
                } else if(_prev.left.overlap){
                    _prev = service.getPanel(cardList, _prev.left.overlap);
                    _inRange = true;
                }
                _prevCount++;
            }
        }
        if(_next){
            while((_next.below.overlap || _next.right.overlap) && _nextCount < _length){
                if(_next.below.overlap){
                    _next = service.getPanel(cardList, _next.below.overlap);
                    _inStack = true;
                } else if(_next.right.overlap){
                    _next = service.getPanel(cardList, _next.right.overlap);
                    _inRange = true;
                }
                _nextCount++;
            }
        }
        if(_inRange && _inStack){
            return true;
        } else {
            return false;
        }
    };
    
    service.setAdjacentVertical = function(abovePanel, belowPanel){
        abovePanel.below = { adjacent: belowPanel._id, overlap: null };
        abovePanel.right = { adjacent: null, overlap: null };
        belowPanel.above = { adjacent: abovePanel._id, overlap: null };
        belowPanel.left = { adjacent: null, overlap: null };
    };
    
    service.setAdjacentHorizontal = function(leftPanel, rightPanel){
        leftPanel.below = { adjacent: null, overlap: null };
        leftPanel.right = { adjacent: rightPanel._id, overlap: null };
        rightPanel.above = { adjacent: null, overlap: null };
        rightPanel.left = { adjacent: leftPanel._id, overlap: null };
    };
    
    service.setOverlapVertical = function(abovePanel, belowPanel){
        abovePanel.below = { adjacent: null, overlap: belowPanel._id };
        abovePanel.right = { adjacent: null, overlap: null };
        belowPanel.above = { adjacent: null, overlap: abovePanel._id };
        belowPanel.left = { adjacent: null, overlap: null };
    };
    
    service.setOverlapHorizontal = function(leftPanel, rightPanel){
        leftPanel.below = { adjacent: null, overlap: null };
        leftPanel.right = { adjacent: null, overlap: rightPanel._id };
        rightPanel.above = { adjacent: null, overlap: null };
        rightPanel.left = { adjacent: null, overlap: leftPanel._id };
    };
    
    service.mergeGap = function(panel_a, panel_b){
        if(panel_a.below.adjacent && panel_b.above.adjacent){
            service.setAdjacentVertical(panel_a, panel_b);
        } else {
            service.setAdjacentHorizontal(panel_a, panel_b);
        }
    };
    
    service.getPanel = function(cardList, panelId){
        var _panel = CoreVars.nullPanel;
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i]._id === panelId){
                _panel = cardList[i];
            }
        }
        return _panel;
    };
    
    service.getPanelIndex = function(cardList, panelId){
        var _index = -1;
        for(var i = 0; i < cardList.length; i++){
            if(cardList[i]._id === panelId){
                _index = i;
            }
        }
        return _index;
    };
    
    service.getPrev = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _prevPanel = CoreVars.nullPanel;
        var _prevIndex = -1;
        if(_panel.above.adjacent){
            _prevPanel = service.getPanel(cardList, _panel.above.adjacent);
            _prevIndex = service.getPanelIndex(cardList, _panel.above.adjacent);
        } else if(_panel.above.overlap){
            _prevPanel = service.getPanel(cardList, _panel.above.overlap);
            _prevIndex = service.getPanelIndex(cardList, _panel.above.overlap);
        } else if(_panel.left.adjacent){
            _prevPanel = service.getPanel(cardList, _panel.left.adjacent);
            _prevIndex = service.getPanelIndex(cardList, _panel.left.adjacent);
        } else if(_panel.left.overlap){
            _prevPanel = service.getPanel(cardList, _panel.left.overlap);
            _prevIndex = service.getPanelIndex(cardList, _panel.left.overlap);
        }
        return _prevPanel;
    };
    
    service.getNext = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _nextPanel = CoreVars.nullPanel;
        var _nextIndex = -1;
        if(_panel.below.adjacent){
            _nextPanel = service.getPanel(cardList, _panel.below.adjacent);
            _nextIndex = service.getPanelIndex(cardList, _panel.below.adjacent);
        } else if(_panel.below.overlap){
            _nextPanel = service.getPanel(cardList, _panel.below.overlap);
            _nextIndex = service.getPanelIndex(cardList, _panel.below.overlap);
        } else if(_panel.right.adjacent){
            _nextPanel = service.getPanel(cardList, _panel.right.adjacent);
            _nextIndex = service.getPanelIndex(cardList, _panel.right.adjacent);
        } else if(_panel.right.overlap){
            _nextPanel = service.getPanel(cardList, _panel.right.overlap);
            _nextIndex = service.getPanelIndex(cardList, _panel.right.overlap);
        }
        return _nextPanel;
    };
    
    service.getFirst = function(cardList){
        var _panel = CoreVars.nullPanel;
        for(var i = 0; i < cardList.length; i++){
            var test = cardList[i];
            if(!service.hasPrev(test)){
                _panel = test;
            }
        }
        return _panel;
    };
    
    service.getLast = function(cardList){
        var _index = 0;
        var _panel = CoreVars.nullPanel;
        for(var i = 0; i < cardList.length; i++){
            var test = cardList[i];
            if(!service.hasNext(test)){
                _panel = test;
            }
        }
        return _panel;  
    };
    
    service.getPanelOrder = function(cardList, panelId){
        var _order = 0;
        var _panel = service.getFirst(cardList);
        
        while(service.hasNext(_panel) && _panel._id !== panelId){
            if(_panel.below.adjacent){
                _panel = service.getPanel(cardList, _panel.below.adjacent);
                _order++;
            } else if(_panel.below.overlap){
                _panel = service.getPanel(cardList, _panel.below.overlap);
                _order++;
            } else if(_panel.right.adjacent){
                _panel = service.getPanel(cardList, _panel.right.adjacent);
                _order++;
            } else if(_panel.right.overlap){
                _panel = service.getPanel(cardList, _panel.right.overlap);
                _order++;
            }
        }
        return _order;
    };
    
    // Stack: A group of vertically-overlapping cards
    
    service.getStackStart = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _count = 0;
        while((_panel.above.overlap) && _count < cardList.length){
            _panel = service.getPanel(cardList, _panel.above.overlap);
            _count++;
        }
        return _panel;
    };
    
    service.getStackEnd = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _count = 0;
        while((_panel.below.overlap) && _count < cardList.length){
            _panel = service.getPanel(cardList, _panel.below.overlap);
            _count++;
        }
        return _panel;
    };
    
    service.getStack = function(cardList, panel, callBack){
        var _panel = service.getStackStart(cardList, panel._id);
        var _panelArray = [ _panel ];
        var _count = 0;
        
        while((_panel.below.overlap) && _count < cardList.length){
            _panel = service.getPanel(cardList, _panel.below.overlap);
            _panelArray.push(_panel);
        }
        
        if(callBack){
            callBack(_panelArray);
        } else {
            return _panelArray;
        }
    };
    
    // Range: Each card within a column, or multiple columns if horizontally overlapped
    
    service.getRangeStart = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _count = 0;
        
        while((_panel.above.adjacent || _panel.above.overlap || _panel.left.overlap) && _count < cardList.length){
            if(_panel.above.adjacent){
                _panel = service.getPanel(cardList, _panel.above.adjacent);
            } else if (_panel.above.overlap){
                _panel = service.getPanel(cardList, _panel.above.overlap);
            } else if(_panel.left.overlap){
                _panel = service.getPanel(cardList, _panel.left.overlap);
            }
            _count++;
        }
        
        return _panel;
    };
    
    service.getRangeEnd = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _count = 0;
        
        while((_panel.below.adjacent || _panel.below.overlap || _panel.right.overlap) && _count < cardList.length){
            if(_panel.below.adjacent){
                _panel = service.getPanel(cardList, _panel.below.adjacent);
            } else if(_panel.below.overlap){
                _panel = service.getPanel(cardList, _panel.below.overlap);
            } else if(_panel.right.overlap){
                _panel = service.getPanel(cardList, _panel.right.overlap);
            }
        }
        
        return _panel;
    };
    
    service.getRange = function(cardList, panel, callBack){
        var _panel = service.getRangeStart(cardList, panel._id);
        var _panelArray = [ _panel ];
        var _count = 0;
        
        while((_panel.below.adjacent || _panel.below.overlap || _panel.right.overlap) && _count < cardList.length){
            if(_panel.below.adjacent){
                _panel = service.getPanel(cardList, _panel.below.adjacent);
                _panelArray.push(_panel);
            } else if(_panel.below.overlap){
                _panel = service.getPanel(cardList, _panel.below.overlap);
                _panelArray.push(_panel);
            } else if(_panel.right.overlap){
                _panel = service.getPanel(cardList, _panel.right.overlap);
                _panelArray.push(_panel);
            }
        }
        
        if(callBack){
            callBack(_panelArray);
        } else {
            return _panelArray;
        }
    };
    
    // Cluster: A group of overlapping cards (vertical or horizontal)
    
    service.getClusterStart = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _count = 0;
        while((_panel.above.overlap || _panel.left.overlap) && _count < cardList.length){
            if(_panel.left.overlap){
                _panel = service.getPanel(cardList, _panel.left.overlap);
            } else if (_panel.above.overlap){
                _panel = service.getPanel(cardList, _panel.above.overlap);
            }
            _count++;
        }
        
        return _panel;
    };
    
    service.getClusterEnd = function(cardList, panelId){
        var _panel = service.getPanel(cardList, panelId);
        var _count = 0;
        while((_panel.below.overlap || _panel.right.overlap) && _count < cardList.length){
            if(_panel.right.overlap){
                _panel = service.getPanel(cardList, _panel.right.overlap);
            } else if (_panel.below.overlap){
                _panel = service.getPanel(cardList, _panel.below.overlap);
            }
            _count++;
        }
        
        return _panel;
    };
    
    service.getCluster = function(cardList, panel, callBack){
        var _panel = service.getClusterStart(cardList, panel._id);
        var _panelArray = [ _panel ];
        
        while(_panel.below.overlap || _panel.right.overlap){
            if(_panel.below.overlap){
                _panel = service.getPanel(cardList, _panel.below.overlap);
                _panelArray.push(_panel);
            } else if(_panel.right.overlap){
                _panel = service.getPanel(cardList, _panel.right.overlap);
                _panelArray.push(_panel);
            }
        }
        
        if(callBack){
            callBack(_panelArray);
        } else {
            return _panelArray;
        }
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