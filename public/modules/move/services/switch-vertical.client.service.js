'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchVertical', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils){
        
        return function(cardList, slot, panel){
            console.log('switchVertical');
            if(!CoreVars.cardMoving){
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_index = PanelUtils.getPanel(cardList, slot._id).index;
                var slot_y_overlap = slot.y_overlap;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                
                var panel_index = PanelUtils.getPanel(cardList, panel._id).index;
                var panel_y_overlap = panel.y_overlap;
                
                var lowest_index = PanelUtils.getLowestPanel(cardList, slot_x).index;
                var lowest_y = cardList[lowest_index].y_coord;
                
                if(panel_y - slot_y > 0){
                // PANEL MOVING UP
                    CoreVars.setCardMoving();
                    
                    cardList[slot_index].y_coord = panel_y;
                    cardList[slot_index].y_overlap = panel_y_overlap;
                    $rootScope.$digest();
                    cardList[panel_index].y_coord = slot_y;
                    cardList[panel_index].y_overlap = slot_y_overlap;
                    
                } else if(panel_y - slot_y < 0){
                // PANEL MOVING DOWN
                    CoreVars.setCardMoving();
                    
                    cardList[slot_index].y_coord = panel_y;
                    cardList[slot_index].y_overlap = panel_y_overlap;
                    $rootScope.$digest();
                    cardList[panel_index].y_coord = slot_y;
                    cardList[panel_index].y_overlap = slot_y_overlap;
                }
                $rootScope.$digest();
            }
        };
        
    }]);