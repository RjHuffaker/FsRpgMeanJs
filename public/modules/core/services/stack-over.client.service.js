'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('stackOver', ['$rootScope', 'CoreVars', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, CoreVars, Bakery, CorePanel, CoreStack){
        
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving && !slot.x_overlap && !panel.x_overlap){
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = CorePanel.getPanel(cardList, slot_x, slot_y).index;
                var slot_x_overlap = slot.x_overlap;
                var slot_y_overlap = slot.y_overlap;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_index = CorePanel.getPanel(cardList, panel_x, panel_y).index;
                var panel_x_overlap = panel.x_overlap;
                var panel_y_overlap = panel.y_overlap;
                var panel_lowest_index = CoreStack.getLowestPanel(cardList, panel_x).index;
                var panel_lowest_coord = cardList[panel_lowest_index].y_coord;
                
                var newColumn = panel_x > slot_x ? slot_x : slot_x - CoreVars.x_dim;
                
                if(!slot_x_overlap && !panel_x_overlap){
                    CoreVars.setCardMoving();
                    for(var ia = 0; ia < cardList.length; ia++){
                        if(!cardList[ia].dragging && cardList[ia].x_coord === newColumn && cardList[ia].y_coord > slot_y){
                            cardList[ia].y_coord += panel_lowest_coord + CoreVars.y_tab;
                        }
                        if(cardList[ia].dragging){
                            cardList[ia].x_coord = slot_x;
                            cardList[ia].y_coord += slot_y + CoreVars.y_tab - panel_y;
                        }
                        if(cardList[ia].x_coord > panel_x && panel_y === 0){
                            cardList[ia].x_coord -= CoreVars.x_dim;
                        }
                    }
                    CoreStack.setColumnVars(cardList, newColumn);
                    CoreStack.setColumnVars(cardList, slot_x);
                    CoreStack.setColumnVars(cardList, panel_x);
                }
                $rootScope.$digest();
            }
        };
        
    }]);