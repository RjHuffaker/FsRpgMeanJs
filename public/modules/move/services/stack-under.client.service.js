'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackUnder', ['$rootScope', 'CoreVars', 'Bakery', 'MovePanel', 'MoveStack',
    function($rootScope, CoreVars, Bakery, MovePanel, MoveStack){
        
        // Stack one card behind another and reposition deck to fill the gap
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving && !slot.x_overlap && !panel.x_overlap){
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_index = MovePanel.getPanel(cardList, panel_x, panel_y).index;
                var panel_x_overlap = panel.x_overlap;
                var panel_y_overlap = panel.y_overlap;
                var panel_lowest_coord = MoveStack.getLowestPanel(cardList, panel_x).panel.y_coord;
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = MovePanel.getPanel(cardList, slot_x, slot_y).index;
                var slot_lowest_coord = MoveStack.getLowestPanel(cardList, slot_x).panel.y_coord;
                var newColumn = panel_x > slot_x ? slot_x : slot_x - CoreVars.x_dim;
                
                CoreVars.setCardMoving();
                for(var ia = 0; ia < cardList.length; ia++){
                    if(!cardList[ia].dragging && cardList[ia].x_coord === slot_x){
                        cardList[ia].y_coord += panel_lowest_coord + CoreVars.y_tab;
                    }
                    if(cardList[ia].x_coord > panel_x){
                        cardList[ia].x_coord -= CoreVars.x_dim;
                    }
                    if(cardList[ia].dragging){
                        cardList[ia].x_coord = newColumn;
                    }
                }
                MoveStack.setColumnVars(cardList, newColumn);
                MoveStack.setColumnVars(cardList, slot_x);
                MoveStack.setColumnVars(cardList, panel_x);
                $rootScope.$digest();
            }
        };
        
    }]);