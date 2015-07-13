'use strict';

// Stack helper-functions
angular.module('move').factory('StackUtils', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', function($rootScope, CoreVars, PanelUtils, DeckUtils) {
    
    var service = {};
    
    service.getStack = function(cardList, panel){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
        var _panel = PanelUtils.getRootPanel(cardList, panel._id);
        var _panelArray = [ _panel ];
        
        while(_panel.above.overlap || _panel.right.overlap){
            if(_panel.above.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.above.overlap);
                _panelArray.push(_panel);
            } else if(_panel.right.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
                _panelArray.push(_panel);
            }
        }
        /*
        if(panel.above.overlap){
            while(_testPanel.above.overlap){
                _testPanel = PanelUtils.getPanel(cardList, _testPanel.above.overlap);
                _panelArray.push(_testPanel);
            }
        } else if(panel.below.overlap){
            while(_testPanel.below.overlap){
                _testPanel = PanelUtils.getPanel(cardList, _testPanel.below.overlap);
                _panelArray.push(_testPanel);
            }
        } else if(panel.left.overlap){
            while(_testPanel.left.overlap){
                _testPanel = PanelUtils.getPanel(cardList, _testPanel.left.overlap);
                _panelArray.push(_testPanel);
            }
        } else if(panel.right.overlap){
            while(_testPanel.right.overlap){
                _testPanel = PanelUtils.getPanel(cardList, _testPanel.right.overlap);
                _panelArray.push(_testPanel);
            }
        }
        
        _panelArray.sort(function(a, b){
            var axy = a.x_coord * 100 + a.y_coord;
            var bxy = b.x_coord * 100 + b.y_coord;
            return axy - bxy;
        });
        */
        return _panelArray;
    };
    
    service.setStack = function(cardList, panel, callBack){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
        var _panelArray = [ panel ];
        var _testPanel = panel;
        
        if(panel.above.overlap){
            while(_testPanel.above.overlap){
                _testPanel = PanelUtils.getPanel(cardList, _testPanel.above.overlap);
                _panelArray.push(_testPanel);
            }
        } else if(panel.below.overlap){
            while(_testPanel.below.overlap){
                _testPanel = PanelUtils.getPanel(cardList, _testPanel.below.overlap);
                _panelArray.push(_testPanel);
            }
        } else if(panel.left.overlap){
            while(_testPanel.left.overlap){
                _testPanel = PanelUtils.getPanel(cardList, _testPanel.left.overlap);
                _panelArray.push(_testPanel);
            }
        } else if(panel.right.overlap){
            while(_testPanel.right.overlap){
                _testPanel = PanelUtils.getPanel(cardList, _testPanel.right.overlap);
                _panelArray.push(_testPanel);
            }
        }
        
        _panelArray.sort(function(a, b){
            var axy = a.x_coord * 100 + a.y_coord;
            var bxy = b.x_coord * 100 + b.y_coord;
            return axy - bxy;
        });
        
        if(callBack) callBack(_panelArray);
    };
    
    service.getStackBottom = function(cardList, panelId){
        var _panel = PanelUtils.getPanel(cardList, panelId);
        var _bottom = _panel;
        
        if(_panel.left.overlap){
            while(_bottom.left.overlap){
                _bottom = PanelUtils.getPanel(cardList, _bottom.left.overlap);
            }
        } else if(_panel.below.overlap){
            while(_bottom.below.overlap){
                _bottom = PanelUtils.getPanel(cardList, _bottom.below.overlap);
            }
        }
        return _bottom;
    };
    
    service.getStackTop = function(cardList, panelId){
        var _panel = PanelUtils.getPanel(cardList, panelId);
        var _top = _panel;
        
        if(_panel.right.overlap){
            while(_top.right.overlap){
                _top = PanelUtils.getPanel(cardList, _top.right.overlap);
            }
        } else if(_panel.above.overlap){
            while(_top.above.overlap){
                _top = PanelUtils.getPanel(cardList, _top.above.overlap);
            }
        }
        return _top;
    };
    
    service.getRange = function(cardList, leftId, rightId){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _leftPanel = service.getStackBottom(cardList, leftId);
        var _rightPanel = service.getStackTop(cardList, rightId);
        var _leftOrder = PanelUtils.getPanelOrder(cardList, _leftPanel._id);
        var _rightOrder = PanelUtils.getPanelOrder(cardList, _rightPanel._id);
        
        var _rangeArray = [];
        
        for(var i = 0; i < _refArray.length; i++){
            if(_leftOrder <= i && i <= _rightOrder){
                _rangeArray.push(cardList[_refArray[i]]);
            }
        }
        
        return _rangeArray;
    };
    
    service.setRange = function(cardList, leftId, rightId, callBack){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _leftOrder = PanelUtils.getPanelIndex(cardList, leftId);
        var _rightOrder = PanelUtils.getPanelIndex(cardList, rightId);
        
        var _rangeArray = [];
        
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
        
        while(_panel.above.adjacent || _panel.above.overlap){
            if(_panel.above.adjacent){
                _panel = PanelUtils.getPanel(cardList, _panel.above.adjacent);
                _columnArray.push(_panel);
            } else if(_panel.above.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.above.overlap);
                _columnArray.push(_panel);
            }
        }
        
        return _columnArray;
    };
    
    service.setColumn = function(cardList, panelId, callBack){
        var _panel = PanelUtils.getRootPanel(cardList, panelId);
        var _columnArray = [_panel];
        
        while(_panel.above.adjacent || _panel.above.overlap){
            if(_panel.above.adjacent){
                _panel = PanelUtils.getPanel(cardList, _panel.above.adjacent);
                _columnArray.push(_panel);
            } else if(_panel.above.overlap){
                _panel = PanelUtils.getPanel(cardList, _panel.above.overlap);
                _columnArray.push(_panel);
            }
        }
        
        if(callBack) callBack(_columnArray);
    };
    
    service.getRangeDimens = function(rangeArray){
        var _left = rangeArray[0].x_coord;
        var _right = rangeArray[rangeArray.length-1].x_coord + CoreVars.x_dim_em;
        
        return {
            left: _left,
            right: _right
        };
    };
    
    return service;
    
}]);