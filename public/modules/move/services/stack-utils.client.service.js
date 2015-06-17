'use strict';

// Stack helper-functions
angular.module('move').factory('StackUtils', ['$rootScope', 'PanelUtils', 'DeckUtils', function($rootScope, PanelUtils, DeckUtils) {
    
    var service = {};
    
    service.getStack = function(cardList, panel){
        var _refArray = DeckUtils.getRefArray(cardList);
        var _panelOrder = PanelUtils.getPanel(cardList, panel.x_coord, panel.y_coord).order;
        var _panelArray = [];
        
        if(panel.x_stack){
            for(var ia = 0; ia < _refArray.length; ia++){
                var test_a = cardList[_refArray[ia]];
                if(test_a.x_coord === panel.x_coord - (_panelOrder - ia) * 3){
                    _panelArray.push(test_a);
                }
            }
        } else if(panel.y_stack){
            for(var ib = 0; ib < _refArray.length; ib++){
                var test_b = cardList[_refArray[ib]];
                if(test_b.y_coord === panel.y_coord - (_panelOrder - ib) * 3){
                    _panelArray.push(test_b);
                } else if(test_b.y_coord === panel.y_coord - (_panelOrder - ib) * 21){
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
        var _panelOrder = PanelUtils.getPanel(cardList, panel.x_coord, panel.y_coord).order;
        var _panelArray = [];
        
        if(panel.x_stack){
            for(var ia = 0; ia < _refArray.length; ia++){
                var current_a = cardList[_refArray[ia]];
                if(current_a.x_coord === panel.x_coord - (_panelOrder - ia) * 3){
                    _panelArray.push(current_a);
                }
            }
        } else if(panel.y_stack){
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
        var _panelArray = [];
        for(var i = 0; i < _refArray.length; i++){
            var _current = cardList[_refArray[i]];
            
            if(left_x <= _current.x_coord && _current.x_coord < right_x){
                _panelArray.push(_current);
            }
        }
        
        return _panelArray;
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
    
    service.checkOverlap = function(panel_1, panel_2){
        if(panel_1 && panel_2){
            // console.log('check 1 & 2: '+panel_1.x_coord+'/'+panel_1.y_coord+' & '+panel_2.x_coord+'/'+panel_2.y_coord);
            if(panel_1.x_coord === panel_2.x_coord - 15){
                // console.log('1x = 2x - 15');
                // panel_1.x_stack
                // panel_1.x_overlap
                // panel_1.y_stack
                panel_1.y_overlap = false;
                panel_2.x_stack = false;
                panel_2.x_overlap = false;
                // panel_2.y_stack
                // panel_2.y_overlap
                
            } else if(panel_1.x_coord === panel_2.x_coord - 3){
                // console.log('1x = 2x - 3');
                panel_1.x_stack = true;
                // panel_1.x_overlap
                panel_1.y_stack = false;
                panel_1.y_overlap = false;
                panel_2.x_stack = true;
                panel_2.x_overlap = true;
                panel_2.y_stack = false;
                panel_2.y_overlap = false;
            }
            
            if(panel_1.y_coord === panel_2.y_coord - 21){
                // console.log('1y = 2y - 21');
                panel_1.x_stack = false;
                panel_1.x_overlap = false;
                panel_1.y_stack = true;
                panel_1.y_overlap = false;
                panel_2.x_stack = false;
                panel_2.x_overlap = false;
                panel_2.y_stack = true;
                // panel_2.y_overlap
                
                
            } else if(panel_1.y_coord === panel_2.y_coord - 3){
                // console.log('1y = 2y - 3');
                panel_1.x_stack = false;
                panel_1.x_overlap = false;
                panel_1.y_stack = true;
                panel_1.y_overlap = true;
                panel_2.x_stack = false;
                panel_2.x_overlap = false;
                panel_2.y_stack = true;
                // panel_2.y_overlap
                
            }
        } else if(panel_1 && !panel_2){
            // console.log('check 1: '+panel_1.x_coord+'/'+panel_1.y_coord);
            panel_1.y_overlap = false;
        } else if(!panel_1 && panel_2){
            // console.log('check 2: '+panel_2.x_coord+'/'+panel_2.y_coord);
            panel_2.x_stack = false;
            panel_2.x_overlap = false;
        }
    };
    
    service.setOverlap = function(cardList){
        var _refArray = DeckUtils.getRefArray(cardList);
        for(var i = 0; i < _refArray.length; i++){
            var _previous = cardList[_refArray[i-1]] || null;
            var _current = cardList[_refArray[i]];
            var _next = cardList[_refArray[i+1]] || null;
            service.checkOverlap(_previous, _current);
            service.checkOverlap(_current, _next);
        }
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