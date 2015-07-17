'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('toggleOverlap', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', 'StackUtils',
    function($rootScope, CoreVars, PanelUtils, DeckUtils, StackUtils){
        
        return function(cardList, panel){
            if(!CoreVars.cardMoved && !CoreVars.cardMoving){
                
                console.log('toggleOverlap');
                
                var _refArray = DeckUtils.getRefArray(cardList);
                var _panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
                
                var _panelColumn = StackUtils.getColumn(cardList, panel._id);
                
                var _previous = cardList[_refArray[_panelOrder - 1]] || null;
                var _next = cardList[_refArray[_panelOrder + 1]] || null;
                
                var _last = PanelUtils.getLast(cardList).panel;
                var _lowest = PanelUtils.getLowestPanel(cardList, panel.x_coord).panel;
                
                var unstack_x = function(){
                    CoreVars.setCardMoving();
                    _previous.right.adjacent = panel._id;
                    _previous.right.overlap = null;
                    panel.left.adjacent = _previous._id;
                    panel.left.overlap = null;
                    StackUtils.setRange(cardList, panel._id, _last._id, function(rangeArray){
                        for(var i = 0; i < rangeArray.length; i++){
                            rangeArray[i].x_coord += CoreVars.x_cover_em;
                        }
                    });
                };
                
                var stack_x = function(){
                    CoreVars.setCardMoving();
                    _previous.right.adjacent = null;
                    _previous.right.overlap = panel._id;
                    panel.left.adjacent = null;
                    panel.left.overlap = _previous._id;
                    StackUtils.setRange(cardList, panel._id, _last._id, function(rangeArray){
                        console.log('length '+rangeArray.length);
                        for(var i = 0; i < rangeArray.length; i++){
                            rangeArray[i].x_coord -= CoreVars.x_cover_em;
                        }
                    });
                };
                
                var unstack_y = function(){
                    CoreVars.setCardMoving();
                    panel.above.adjacent = _next._id;
                    panel.above.overlap = null;
                    _next.below.adjacent = panel._id;
                    _next.below.overlap = null;
                    
                    StackUtils.setColumn(cardList, panel._id, function(columnArray){
                        for(var i = 0; i < columnArray.length; i++){
                            if(panel.y_coord < columnArray[i].y_coord){
                                columnArray[i].y_coord += CoreVars.y_cover_em;
                            }
                        }
                    });
                };
                
                var stack_y = function(){
                    CoreVars.setCardMoving();
                    panel.above.adjacent = null;
                    panel.above.overlap = _next._id;
                    _next.below.adjacent = null;
                    _next.below.overlap = panel._id;
                    
                    StackUtils.setColumn(cardList, panel._id, function(columnArray){
                        for(var i = 0; i < columnArray.length; i++){
                            if(panel.y_coord < columnArray[i].y_coord){
                                columnArray[i].y_coord -= CoreVars.y_cover_em;
                            }
                        }
                    });
                };
                console.log('panelId: '+panel._id);
                
                if(_previous && _panelColumn.length === 1){
                    if(panel.left.overlap && _previous.right.overlap){
                        if(panel.left.overlap === _previous._id && _previous.right.overlap === panel._id){
                            unstack_x();
                        }
                    } else if(panel.left.adjacent && _previous.right.adjacent){
                        if(panel.left.adjacent === _previous._id && _previous.right.adjacent === panel._id){
                            stack_x();
                        }
                    }
                }
                
                if(_next && _panelColumn.length > 1){
                    if(panel.above.overlap && _next.below.overlap){
                        if(panel.above.overlap === _next._id && _next.below.overlap === panel._id){
                            unstack_y();
                        }
                    } else if(panel.above.adjacent && _next.below.adjacent){
                        if(panel.above.adjacent === _next._id && _next.below.adjacent === panel._id){
                            stack_y();
                        }
                    }
                }
                
                $rootScope.$digest();
                CoreVars.cardMoved = false;
            }
        };
        
    }]);