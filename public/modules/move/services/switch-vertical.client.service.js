'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchVertical', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils){
        
        return function(cardList, slot, panel){
            console.log('switchVertical');
            if(!CoreVars.cardMoving){
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = PanelUtils.getPanelIndex(cardList, slot._id);
                var slot_y_overlap = slot.above.overlap;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                
                var panel_index = PanelUtils.getPanelIndex(cardList, panel._id);
                var panel_y_overlap = panel.above.overlap;
                
                var lowest_index = PanelUtils.getLowestPanel(cardList, slot_x).index;
                var lowest_y = cardList[lowest_index].y_coord;
                
                if(panel_y - slot_y > 0){
                // PANEL MOVING UP
                    CoreVars.setCardMoving();
                    
                    cardList[slot_index].y_coord = panel_y;
                    cardList[slot_index].above.overlap = panel_y_overlap;
                    $rootScope.$digest();
                    cardList[panel_index].y_coord = slot_y;
                    cardList[panel_index].above.overlap = slot_y_overlap;
                    
                } else if(panel_y - slot_y < 0){
                // PANEL MOVING DOWN
                    CoreVars.setCardMoving();
                    
                    cardList[slot_index].y_coord = panel_y;
                    cardList[slot_index].above.overlap = panel_y_overlap;
                    $rootScope.$digest();
                    cardList[panel_index].y_coord = slot_y;
                    cardList[panel_index].above.overlap = slot_y_overlap;
                }
                $rootScope.$digest();
            }
        };
        
    }]);