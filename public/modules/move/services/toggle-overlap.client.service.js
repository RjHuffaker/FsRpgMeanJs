'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('toggleOverlap', ['$rootScope', 'CoreVars', 'Bakery', 'MovePanel', 'MoveStack',
    function($rootScope, CoreVars, Bakery, MovePanel, MoveStack){
        
        return function(cardList, panel){
            if(!CoreVars.cardMoved){
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_x_overlap = panel.x_overlap;
                var panel_y_overlap = panel.y_overlap;
                var panel_index = MovePanel.getPanel(cardList, panel_x, panel_y).index;
                var lowest_index = MoveStack.getLowestPanel(cardList, panel_x).index;
                var lowest_y = cardList[lowest_index].y_coord;
                
                if(panel_x > 0 && lowest_y === 0){
                // x_overlap
                    if(panel_x_overlap && !CoreVars.cardMoving){
                    // Card overlapped
                        CoreVars.setCardMoving();
                        cardList[panel_index].x_overlap = false;
                        for(var ia = 0; ia < cardList.length; ia++){
                            if(panel_x <= cardList[ia].x_coord){
                                cardList[ia].x_coord += CoreVars.x_cover;
                            }
                        }
                    } else if(!panel_x_overlap && !CoreVars.cardMoving){
                    // Card not overlapped
                        CoreVars.setCardMoving();
                        cardList[panel_index].x_overlap = true;
                        for(var ib = 0; ib < cardList.length; ib++){
                            if(panel_x <= cardList[ib].x_coord){
                                cardList[ib].x_coord -= CoreVars.x_cover;
                            }
                        }
                    }
                } else if(panel_y !== lowest_y){
                // y_overlap
                    if(panel_y_overlap && !CoreVars.cardMoving){
                    // Card overlapped
                        CoreVars.setCardMoving();
                        cardList[panel_index].y_overlap = false;
                        for(var ic = 0; ic < cardList.length; ic++){
                            if(panel_x === cardList[ic].x_coord && panel_y < cardList[ic].y_coord){
                                cardList[ic].y_coord += CoreVars.y_cover;
                            }
                        }
                    } else if(!panel_y_overlap && !CoreVars.cardMoving){
                    // Card not overlapped
                        CoreVars.setCardMoving();
                        cardList[panel_index].y_overlap = true;
                        for(var id = 0; id < cardList.length; id++){
                            if(panel_x === cardList[id].x_coord && panel_y < cardList[id].y_coord){
                                cardList[id].y_coord -= CoreVars.y_cover;
                            }
                        }
                    }
                }
                $rootScope.$digest();
                CoreVars.cardMoved = false;
            }
        };
        
    }]);