'use strict';

// Stack helper-functions
angular.module('move').factory('StackUtils', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', function($rootScope, CoreVars, PanelUtils, DeckUtils) {
    
    var service = {};
    
    service.getStack = function(cardList, panel){
        var _panel = service.getStackAbove(cardList, panel._id);
        var _panelArray = [ _panel ];
        
        while(_panel.below.overlap || _panel.right.overlap){
            if(_panel.below.overlap){
                console.log('getStack: panel.below.overlap',_panel.below.overlap);
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                _panelArray.push(_panel);
            } else if(_panel.right.overlap){
                console.log('getStack: panel.right.overlap',_panel.right.overlap);
                _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
                _panelArray.push(_panel);
            }
        }
        
        return _panelArray;
    };
    
    service.setStack = function(cardList, panel, callBack){
        var _panel = service.getStackAbove(cardList, panel._id);
        var _panelArray = [ _panel ];
        
        while(_panel.below.overlap || _panel.right.overlap){
            if(_panel.below.overlap){
                console.log('setStack: panel.below.overlap', _panel.below.overlap);
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                _panelArray.push(_panel);
            } else if(_panel.right.overlap){
                console.log('setStack: panel.right.overlap', _panel.right.overlap);
                _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
                _panelArray.push(_panel);
            }
        }
        
        if(callBack) callBack(_panelArray);
    };
    
    service.getStackAbove = function(cardList, panelId){
        var _panel = PanelUtils.getPanel(cardList, panelId);
        
        while(_panel.above.overlap || _panel.left.overlap){
            if(_panel.above.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.above.overlap);
            } else if(_panel.left.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.left.overlap);
            }
        }
        
        return _panel;
    };
    
    service.getStackBelow = function(cardList, panelId){
        var _panel = PanelUtils.getPanel(cardList, panelId);
        
        while(_panel.below.overlap || _panel.right.overlap){
            if(_panel.below.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
            } else if(_panel.right.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
            }
        }
        
        return _panel;
    };
    
    service.getRange = function(cardList, leftId, rightId){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _leftOrder = PanelUtils.getPanelOrder(cardList, leftId);
        var _rightOrder = PanelUtils.getPanelOrder(cardList, rightId);
        
        var _rangeArray = [];
        
        // console.log('getRange: '+_leftOrder+'/'+_rightOrder);
        
        for(var i = 0; i < _refArray.length; i++){
            if(_leftOrder <= i && i <= _rightOrder){
                _rangeArray.push(cardList[_refArray[i]]);
            }
        }
        
        return _rangeArray;
    };
    
    service.setRange = function(cardList, leftId, rightId, callBack){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _leftOrder = PanelUtils.getPanelOrder(cardList, leftId);
        var _rightOrder = PanelUtils.getPanelOrder(cardList, rightId);
        
        var _rangeArray = [];
        
        // console.log('setRange: '+_leftOrder+'/'+_rightOrder);
        
        for(var i = 0; i < _refArray.length; i++){
            if(_leftOrder <= i && i <= _rightOrder){
                _rangeArray.push(cardList[_refArray[i]]);
            }
        }
        
        if(callBack) callBack(_rangeArray);
    };
    
    service.getColumn = function(cardList, panelId){
        var _panel = PanelUtils.getRootPanel(cardList, panelId);
        var _columnArray = [_panel];
        
        while(_panel.below.adjacent || _panel.below.overlap){
            if(_panel.below.adjacent){
                _panel = PanelUtils.getPanel(cardList, _panel.below.adjacent);
                _columnArray.push(_panel);
            } else if(_panel.below.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                _columnArray.push(_panel);
            }
        }
        
        return _columnArray;
    };
    
    service.setColumn = function(cardList, panelId, callBack){
        var _panel = PanelUtils.getRootPanel(cardList, panelId);
        var _columnArray = [_panel];
        
        while(_panel.below.adjacent || _panel.below.overlap){
            if(_panel.below.adjacent){
                _panel = PanelUtils.getPanel(cardList, _panel.below.adjacent);
                _columnArray.push(_panel);
            } else if(_panel.below.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                _columnArray.push(_panel);
            }
        }
        
        if(callBack) callBack(_columnArray);
    };
    
    service.getRangeDimens = function(rangeArray){
        var _above = rangeArray[0].y_coord;
        var _below = rangeArray[rangeArray.length-1].y_coord + CoreVars.y_dim_em;
        var _left = rangeArray[0].x_coord;
        var _right = rangeArray[rangeArray.length-1].x_coord + CoreVars.x_dim_em;
        
        return {
            above: _above,
            below: _below,
            left: _left,
            right: _right
        };
    };
    
    return service;
    
}]);
