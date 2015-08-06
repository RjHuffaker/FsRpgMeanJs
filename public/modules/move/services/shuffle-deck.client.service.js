'use strict';

angular.module('move').factory('shuffleDeck', ['$rootScope', 'PanelUtils', 'DeckUtils', 'setPanelPosition',
    function($rootScope, PanelUtils, DeckUtils, setPanelPosition){
        
        return function(cardList){
            var _refArray = DeckUtils.getRefArray(cardList);
            
            _refArray.sort(function() { return 0.5 - Math.random(); });
            
            for(var i = 0; i < _refArray.length; i++){
                var _prev = cardList[_refArray[i - 1]] || null;
                var _curr = cardList[_refArray[i]];
                var _next = cardList[_refArray[i + 1]] || null;
                
                if(_prev){
                    var _1d4 = Math.floor(Math.random() * 4 + 1);
                    switch(_1d4){
                        case 1:
                            if(_prev.above.overLap){
                                PanelUtils.setAdjacentVertical(_prev, _curr);
                            } else {
                                PanelUtils.setAdjacentHorizontal(_prev, _curr);
                            }
                            break;
                        case 2:
                            if(_prev.above.overLap){
                                PanelUtils.setOverlapVertical(_prev, _curr);
                            } else {
                                PanelUtils.setOverlapHorizontal(_prev, _curr);
                            }
                            break;
                        case 3:
                            if(_prev.left.overLap){
                                PanelUtils.setAdjacentHorizontal(_prev, _curr);
                            } else {
                                PanelUtils.setAdjacentVertical(_prev, _curr);
                            }
                            break;
                        case 4:
                            if(_prev.left.overLap){
                                PanelUtils.setOverlapHorizontal(_prev, _curr);
                            } else {
                                PanelUtils.setOverlapVertical(_prev, _curr);
                            }
                            break;
                    }
                    if(!_next){
                        _curr.below = { adjacent: null, overlap: null };
                        _curr.right = { adjacent: null, overlap: null };
                    }
                } else {
                    _curr.above = { adjacent: null, overlap: null };
                    _curr.below = { adjacent: null, overlap: null };
                    _curr.left = { adjacent: null, overlap: null };
                    _curr.right = { adjacent: null, overlap: null };
                }
            }
            
            setPanelPosition(cardList);
            
        };
        
    }]);