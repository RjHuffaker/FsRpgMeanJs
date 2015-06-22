'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('toggleOverlap', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', 'StackUtils',
    function($rootScope, CoreVars, PanelUtils, DeckUtils, StackUtils){
        
        return function(cardList, panel){
            if(!CoreVars.cardMoved && !CoreVars.cardMoving){
                
                console.log('toggleOverlap');
                
                var _refArray = DeckUtils.getRefArray(cardList);
                var _panelObject = PanelUtils.getPanel(cardList, panel._id);
                var _panelOrder = _panelObject.order;
                
                var _panelColumn = StackUtils.getColumn(cardList, panel.x_coord);
                
                var _previous = cardList[_refArray[_panelOrder - 1]] || null;
                var _next = cardList[_refArray[_panelOrder + 1]] || null;
                
                var _last = PanelUtils.getLastPanel(cardList).panel;
                var _lowest = PanelUtils.getLowestPanel(cardList, panel.x_coord).panel;
                
                var unstack_x = function(){
                    console.log('unstack_x - _previous: '+_previous.x_coord+'/'+_previous.y_coord);
                    console.log('unstack_x - panel: '+panel.x_coord+'/'+panel.y_coord);
                    CoreVars.setCardMoving();
                    _previous.rightId = null;
                    panel.leftId = null;
                    StackUtils.setRange(cardList, panel.x_coord, _last.x_coord+1, function(rangeArray){
                        for(var ia = 0; ia < rangeArray.length; ia++){
                            rangeArray[ia].x_coord += CoreVars.x_cover_em;
                        }
                    });
                };
                
                var stack_x = function(){
                    console.log('stack_x - _previous: '+_previous.x_coord+'/'+_previous.y_coord);
                    console.log('stack_x - panel: '+panel.x_coord+'/'+panel.y_coord);
                    CoreVars.setCardMoving();
                    _previous.rightId = panel._id;
                    panel.leftId = _previous._id;
                    StackUtils.setRange(cardList, panel.x_coord, _last.x_coord+1, function(rangeArray){
                        for(var ia = 0; ia < rangeArray.length; ia++){
                            rangeArray[ia].x_coord -= CoreVars.x_cover_em;
                        }
                    });
                };
                
                var unstack_y = function(){
                    console.log('unstack_y - panel: '+panel.x_coord+'/'+panel.y_coord);
                    console.log('unstack_y - _next: '+_next.x_coord+'/'+_next.y_coord);
                    CoreVars.setCardMoving();
                    panel.aboveId = null;
                    _next.belowId = null;
                    StackUtils.setColumn(cardList, panel.x_coord, function(columnArray){
                        console.log('columnArray length '+columnArray.length);
                        for(var i = 0; i < columnArray.length; i++){
                            console.log('unstack_y: '+columnArray[i].y_coord);
                            if(panel.y_coord < columnArray[i].y_coord){
                                columnArray[i].y_coord += CoreVars.y_cover_em;
                            }
                        }
                    });
                };
                
                var stack_y = function(){
                    console.log('stack_y - panel: '+panel.x_coord+'/'+panel.y_coord);
                    console.log('stack_y - _next: '+_next.x_coord+'/'+_next.y_coord);
                    CoreVars.setCardMoving();
                    panel.aboveId = _next._id;
                    _next.belowId = panel._id;
                    StackUtils.setColumn(cardList, panel.x_coord, function(columnArray){
                        console.log('columnArray length '+columnArray.length);
                        for(var i = 0; i < columnArray.length; i++){
                            console.log('stack_y: '+columnArray[i].y_coord);
                            if(panel.y_coord < columnArray[i].y_coord){
                                columnArray[i].y_coord -= CoreVars.y_cover_em;
                            }
                        }
                    });
                };
                console.log('panelId: '+panel._id);
                
                if(_previous && _panelColumn.length === 1){
                    if(panel.leftId && _previous.rightId){
                        if(panel.x_coord === _previous.x_coord + 3){
                            unstack_x();
                        }
                    } else if(panel.y_coord === _previous.y_coord){
                        if(panel.x_coord === _previous.x_coord + 15){
                            stack_x();
                        }
                    }
                }
                
                if(_next && !panel.leftId && !panel.rightId){
                    if(panel.aboveId && _next.belowId){
                        if(panel.y_coord === _next.y_coord - 3){
                            unstack_y();
                        }
                    } else if(panel.x_coord === _next.x_coord){
                        if(panel.y_coord === _next.y_coord - 21){
                            stack_y();
                        }
                    }
                }
                
                $rootScope.$digest();
                CoreVars.cardMoved = false;
            }
        };
        
    }]);