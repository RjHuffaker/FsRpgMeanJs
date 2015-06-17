'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('toggleOverlap', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', 'StackUtils',
    function($rootScope, CoreVars, PanelUtils, DeckUtils, StackUtils){
        
        return function(cardList, panel){
            if(!CoreVars.cardMoved && !CoreVars.cardMoving){
                
                console.log('toggleOverlap');
                
                var _refArray = DeckUtils.getRefArray(cardList);
                var _panelOrder = PanelUtils.getPanel(cardList, panel.x_coord, panel.y_coord).order;
                var _previous = cardList[_refArray[_panelOrder - 1]];
                var _last = PanelUtils.getLastPanel(cardList).panel;
                var _lowest = PanelUtils.getLowestPanel(cardList, panel.x_coord).panel;
                
                if(panel.x_coord > 0 && _lowest.y_coord === 0 && !_previous.y_stack){
                // x_overlap
                    if(panel.x_overlap){
                    // Card overlapped
                        CoreVars.setCardMoving();
                        StackUtils.setRange(cardList, panel.x_coord, _last.x_coord+1, function(rangeArray){
                            for(var ia = 0; ia < rangeArray.length; ia++){
                                rangeArray[ia].x_coord += CoreVars.x_cover_em;
                            }
                        });
                    } else if(!panel.x_overlap){
                    // Card not overlapped
                        CoreVars.setCardMoving();
                        StackUtils.setRange(cardList, panel.x_coord, _last.x_coord+1, function(rangeArray){
                            for(var ia = 0; ia < rangeArray.length; ia++){
                                rangeArray[ia].x_coord -= CoreVars.x_cover_em;
                            }
                        });
                    }
                } else if(panel.y_coord !== _lowest.y_coord){
                // y_overlap
                    if(panel.y_overlap){
                    // Card overlapped
                        CoreVars.setCardMoving();
                        StackUtils.setStack(cardList, panel, function(stackArray){
                            for(var i = 0; i < stackArray.length; i++){
                                var _current = stackArray[i];
                                if(panel.y_coord < _current.y_coord){
                                    _current.y_coord += CoreVars.y_cover_em;
                                }
                            }
                        });
                        
                    } else if(!panel.y_overlap){
                    // Card not overlapped
                        CoreVars.setCardMoving();
                        StackUtils.setStack(cardList, panel, function(stackArray){
                            panel.y_overlap = true;
                            for(var i = 0; i < stackArray.length; i++){
                                var _current = stackArray[i];
                                if(panel.y_coord < _current.y_coord){
                                    _current.y_coord -= CoreVars.y_cover_em;
                                }
                            }
                        });
                    }
                }
                
                StackUtils.setOverlap(cardList);
                $rootScope.$digest();
                CoreVars.cardMoved = false;
            }
        };
        
    }]);