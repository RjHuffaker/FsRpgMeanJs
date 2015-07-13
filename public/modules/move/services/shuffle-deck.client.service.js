'use strict';

angular.module('move').factory('shuffleDeck', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', 'StackUtils',
    function($rootScope, CoreVars, PanelUtils, DeckUtils, StackUtils){
        
        return function(cardList){
            var _refArray = DeckUtils.getRefArray(cardList),
                _x_coord = 0,
                _y_coord = 0;
            
            var pushRight = function(current, previous){
                _x_coord += 15;
                _y_coord = 0;
                
                current.x_coord = _x_coord;
                current.y_coord = _y_coord;
                current.above = { adjacent: null, overlap: null };
                current.below = { adjacent: null, overlap: null };
                current.left = { adjacent: previous._id, overlap: null };
                current.right = { adjacent: null, overlap: null };
                
                previous.right = { adjacent: current._id, overlap: null };
            };
            
            var stackRight = function(current, previous){
                _x_coord += 3;
                _y_coord = 0;
                
                current.x_coord = _x_coord;
                current.y_coord = _y_coord;
                current.above = { adjacent: null, overlap: null };
                current.below = { adjacent: null, overlap: null };
                current.left = { adjacent: null, overlap: previous._id };
                current.right = { adjacent: null, overlap: null };
                
                previous.right = { adjacent: null, overlap: current._id };
            };
            
            var pushUp = function(current, previous){
                _y_coord += 21;
                
                current.x_coord = _x_coord;
                current.y_coord = _y_coord;
                current.above = { adjacent: null, overlap: null };
                current.below = { adjacent: current._id, overlap: null };
                current.left = { adjacent: null, overlap: null };
                current.right = { adjacent: null, overlap: null };
                
                previous.above = { adjacent: current._id, overlap: null };
            };
            
            var stackUp = function(current, previous){
                _y_coord += 3;
                
                current.x_coord = _x_coord;
                current.y_coord = _y_coord;
                current.above = { adjacent: null, overlap: null };
                current.below = { adjacent: null, overlap: previous._id };
                current.left = { adjacent: null, overlap: null };
                current.right = { adjacent: null, overlap: null };
                
                previous.above = { adjacent: null, overlap: previous._id };
            };
            
            _refArray.sort(function() { return 0.5 - Math.random(); });
            
            for(var i = 0; i < _refArray.length; i++){
                var _previous = cardList[_refArray[i - 1]] || null;
                var _current = cardList[_refArray[i]];
                var _next = cardList[_refArray[i] + 1] || null;
                
                if(_previous){
                    var _1d4 = Math.floor(Math.random() * 4 + 1);
                    switch(_1d4){
                        case 1:
                            if(_previous.left.overlap){
                                pushRight(_current, _previous);
                            } else if(_previous.below.overlap || _previous.y_coord > 0){
                                pushRight(_current, _previous);
                            } else {
                                pushRight(_current, _previous);
                            }
                            break;
                        case 2:
                            if(_previous.left.overlap){
                                stackRight(_current, _previous);
                            } else if(_previous.below.overlap || _previous.y_coord > 0){
                                pushRight(_current, _previous);
                            } else {
                                stackRight(_current, _previous);
                            }
                            break;
                        case 3:
                            if(_previous.left.overlap){
                                pushRight(_current, _previous);
                            } else if(_previous.below.overlap || _previous.y_coord > 0){
                                stackUp(_current, _previous);
                            } else {
                                pushUp(_current, _previous);
                            }
                            break;
                        case 4:
                            if(_previous.left.overlap){
                                stackRight(_current, _previous);
                            } else if(_previous.below.overlap || _previous.y_coord > 0){
                                stackUp(_current, _previous);
                            } else {
                                stackUp(_current, _previous);
                            }
                            break;
                    }
                } else {
                    _current.x_coord = 0;
                    _current.y_coord = 0;
                    _current.above = { adjacent: null, overlap: null };
                    _current.below = { adjacent: null, overlap: null };
                    _current.left = { adjacent: null, overlap: null };
                    _current.right = { adjacent: null, overlap: null };
                }
            }
            
        };
        
    }]);