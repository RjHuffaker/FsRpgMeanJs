'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchHorizontal', ['$rootScope', 'CoreVars', 'Bakery', 'MovePanel', 'MoveStack',
    function($rootScope, CoreVars, Bakery, MovePanel, MoveStack){
        
        return function(cardList, slot, panel){
            console.log('switchHorizontal');
            if(!CoreVars.cardMoving){
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = MovePanel.getPanel(cardList, slot_x, slot_y).index;
                var slot_x_overlap = slot.x_overlap;
                var slot_position = slot_x;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_index = MovePanel.getPanel(cardList, panel_x, panel_y).index;
                var panel_x_overlap = panel.x_overlap;
                var panel_width = CoreVars.x_dim;
                
                if(panel_x - slot_x > 0){
                // PANEL MOVING LEFT
                    CoreVars.setCardMoving();
                    
                    if(slot_x === 0 && panel_x_overlap){
                        slot_position = 0;
                        panel_width -= CoreVars.x_cover;
                        cardList[slot_index].x_overlap = true;
                        cardList[panel_index].x_overlap = false;
                    } else {
                        if(panel_x_overlap){
                            panel_width -= CoreVars.x_cover;
                            slot_position -= CoreVars.x_cover;
                        }
                        if(slot_x_overlap){
                            slot_position += CoreVars.x_cover;
                        }
                    }
                    for(var ia = 0; ia < cardList.length; ia++){
                        if(cardList[ia].x_coord >= slot_x && cardList[ia].x_coord < panel_x){
                        // Modify position of each card in "SLOT" column and to the left of "PANEL" column
                            cardList[ia].x_coord += panel_width;
                        } else if(cardList[ia].x_coord === panel_x){
                        // Modify position of each card in "PANEL" column
                            cardList[ia].x_coord = slot_position;
                        }
                    }
                } else if(panel_x - slot_x < 0){
                // PANEL MOVING RIGHT
                    CoreVars.setCardMoving();
                    if(panel_x === 0 && slot_x_overlap){
                        var first_index = MovePanel.getPanel(cardList, 0, 0);
                //      cardList[first_index].x_coord = 0;
                        cardList[first_index].x_overlap = false;
                        cardList[panel_index].x_overlap = true;
                        panel_width -= CoreVars.x_cover;
                    } else if(panel_x > 0){
                        if(panel_x_overlap){
                            panel_width -= CoreVars.x_cover;
                        }
                    }
                    
                    for(var ib = 0; ib < cardList.length; ib++){
                        if(cardList[ib].x_coord <= slot_x && cardList[ib].x_coord > panel_x){
                        // Modify position of each card in "SLOT" column
                            cardList[ib].x_coord -= panel_width;
                        } else if(cardList[ib].x_coord === panel_x){
                        // Modify position of each card in "PANEL" column
                            cardList[ib].x_coord = slot_position;
                        }
                    }
                }
                $rootScope.$digest();
            }
        };
        
    }]);