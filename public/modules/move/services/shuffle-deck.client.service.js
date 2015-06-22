'use strict';

angular.module('move').factory('shuffleDeck', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', 'StackUtils',
    function($rootScope, CoreVars, PanelUtils, DeckUtils, StackUtils){
        
        return function(cardList){
            var _refArray = DeckUtils.getRefArray(cardList),
                _x_coord = 0,
                _y_coord = 0;
            
            var pushRight = function(current, previous){
                console.log('pushRight');
                _x_coord += 15;
                _y_coord = 0;
                current.x_coord = _x_coord;
                current.y_coord = _y_coord;
                previous.belowId = null;
                previous.rightId = null;
                current.aboveId = null;
                current.belowId = null;
                current.leftId = null;
                current.rightId = null;
            };
            
            var stackRight = function(current, previous){
                console.log('stackRight');
                _x_coord += 3;
                _y_coord = 0;
                current.x_coord = _x_coord;
                current.y_coord = _y_coord;
                previous.rightId = current._id;
                current.aboveId = null;
                current.belowId = null;
                current.leftId = previous._id;
                current.rightId = null;
            };
            
            var pushUp = function(current, previous){
                console.log('pushUp');
                _y_coord += 21;
                current.x_coord = _x_coord;
                current.y_coord = _y_coord;
                previous.belowId = null;
                current.aboveId = null;
                current.belowId = null;
                current.leftId = null;
                current.rightId = null;
            };
            
            var stackUp = function(current, previous){
                console.log('stackUp');
                _y_coord += 3;
                current.x_coord = _x_coord;
                current.y_coord = _y_coord;
                previous.belowId = current._id;
                current.aboveId = previous._id;
                current.belowId = null;
                current.leftId = null;
                current.rightId = null;
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
                            if(_previous.leftId){
                                pushRight(_current, _previous);
                            } else if(_previous.belowId || _previous.y_coord > 0){
                                pushRight(_current, _previous);
                            } else {
                                pushRight(_current, _previous);
                            }
                            break;
                        case 2:
                            if(_previous.leftId){
                                stackRight(_current, _previous);
                            } else if(_previous.belowId || _previous.y_coord > 0){
                                pushRight(_current, _previous);
                            } else {
                                stackRight(_current, _previous);
                            }
                            break;
                        case 3:
                            if(_previous.leftId){
                                pushRight(_current, _previous);
                            } else if(_previous.belowId || _previous.y_coord > 0){
                                stackUp(_current, _previous);
                            } else {
                                pushUp(_current, _previous);
                            }
                            break;
                        case 4:
                            if(_previous.leftId){
                                stackRight(_current, _previous);
                            } else if(_previous.belowId || _previous.y_coord > 0){
                                stackUp(_current, _previous);
                            } else {
                                stackUp(_current, _previous);
                            }
                            break;
                    }
                } else {
                    _current.x_coord = 0;
                    _current.y_coord = 0;
                    _current.leftId = null;
                    _current.aboveId = null;
                }
            }
            
        };
        
    }]);