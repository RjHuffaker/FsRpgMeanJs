'use strict';

// Stack helper-functions
angular.module('move').factory('StackUtils', ['$rootScope', 'PanelUtils', 'DeckUtils', function($rootScope, PanelUtils, DeckUtils) {
    
    var service = {};
    
    service.getStack = function(cardList, panel){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _panelOrder = PanelUtils.getPanel(cardList, panel._id).order;
        var _panelArray = [];
        console.log('getStack: '+panel.aboveId+'/'+panel.belowId+'/'+panel.leftId+'/'+panel.rightId);
        
        if(panel.leftId || panel.rightId){
            for(var ia = 0; ia < _refArray.length; ia++){
                var test_a = cardList[_refArray[ia]];
                if(test_a.x_coord === panel.x_coord - (_panelOrder - ia) * 3){
                    _panelArray.push(test_a);
                }
            }
        } else if(panel.aboveId || panel.belowId){
            for(var ib = 0; ib < _refArray.length; ib++){
                var test_b = cardList[_refArray[ib]];
                if(test_b.y_coord === panel.y_coord - (_panelOrder - ib) * 3){
                    _panelArray.push(test_b);
                }
            }
        } else {
            _panelArray.push(panel);
        }
        
        _panelArray.sort(function(a, b){
            var axy = a.x_coord * 100 + a.y_coord;
            var bxy = b.x_coord * 100 + b.y_coord;
            return axy - bxy;
        });
        
        return _panelArray;
    };
    
    service.setStack = function(cardList, panel, callBack){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _panelOrder = PanelUtils.getPanel(cardList, panel._id).order;
        var _panelArray = [];
        if(panel.aboveId) console.log('aboveId: '+panel.aboveId);
        if(panel.belowId) console.log('belowId: '+panel.belowId);
        if(panel.leftId) console.log('leftId: '+panel.leftId);
        if(panel.rightId) console.log('rightId: '+panel.rightId);
        
        if(panel.leftId || panel.rightId){
            for(var ia = 0; ia < _refArray.length; ia++){
                var current_a = cardList[_refArray[ia]];
                if(current_a.x_coord === panel.x_coord - (_panelOrder - ia) * 3){
                    _panelArray.push(current_a);
                }
            }
        } else if(panel.aboveId || panel.belowId){
            for(var ib = 0; ib < _refArray.length; ib++){
                var current_b = cardList[_refArray[ib]];
                if(current_b.y_coord === panel.y_coord - (_panelOrder - ib) * 3){
                    _panelArray.push(current_b);
                }
            }
        } else {
            _panelArray.push(panel);
        }
        
        if(callBack) callBack(_panelArray);
    };
    
    service.getRange = function(cardList, left_x, right_x){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _rangeArray = [];
        for(var i = 0; i < _refArray.length; i++){
            var _current = cardList[_refArray[i]];
            
            if(left_x <= _current.x_coord && _current.x_coord < right_x){
                _rangeArray.push(_current);
            }
        }
        
        return _rangeArray;
    };
    
    service.setRange = function(cardList, left_x, right_x, callBack){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _rangeArray = [];
        
        for(var i = 0; i < _refArray.length; i++){
            var _previous = cardList[_refArray[i - 1]] || null;
            var _current = cardList[_refArray[i]];
            var _next = cardList[_refArray[i + 1]] || null;
            
            if(left_x <= _current.x_coord && _current.x_coord < right_x){
                _rangeArray.push(_current);
            }
        }
        
        if(callBack) callBack(_rangeArray);
    };
    
    service.getColumn = function(cardList, x_coord){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _columnArray = [];
        
        for(var i = 0; i < _refArray.length; i++){
            var _test = cardList[_refArray[i]];
            if(_test.x_coord === x_coord){
                _columnArray.push(_test);
            }
        }
        
        return _columnArray;
    };
    
    service.setColumn = function(cardList, x_coord, callBack){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _columnArray = [];
        
        for(var i = 0; i < _refArray.length; i++){
            var _test = cardList[_refArray[i]];
            if(_test.x_coord === x_coord){
                _columnArray.push(_test);
            }
        }
        
        if(callBack) callBack(_columnArray);
    };
    
    service.getStackDimens = function(cardList, panel){
        var _stackArray = service.getStack(cardList, panel);
        if(!_stackArray.length){
            console.log('Bingo!');
            console.log(cardList);
            console.log(panel);
        }
        var _left = _stackArray[0].x_coord;
        var _right = _stackArray[_stackArray.length-1].x_coord;
        
        return {
            left: _left,
            right: _right
        };
    };
    
    return service;
    
}]);