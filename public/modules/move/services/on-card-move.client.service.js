'use strict';

angular.module('move').factory('onCardMove', ['CoreVars', 'checkEdge', 'movePanel',
    function(CoreVars, checkEdge, movePanel){
        
        return function(cardList, object){
            
            if(CoreVars.cardMoving) return;
            
            var vectorX = Math.abs(object.moveX);
            var vectorY = Math.abs(object.moveY);
            
            var slot = object.slot;
            var slot_x = slot.x_coord + slot.x_dim;
            var slot_y = slot.y_coord + slot.y_dim;
            var slot_x_overlap = slot.left.overlap || slot.right.overlap;
            var slot_y_overlap = slot.above.overlap || slot.below.overlap;
            
            var panel = object.panel;
            var panel_x = panel.x_coord + panel.x_dim;
            var panel_y = panel.y_coord + panel.y_dim;
            var panel_x_overlap = panel.left.overlap || panel.right.overlap;
            var panel_y_overlap = panel.above.overlap || panel.below.overlap;
            
            var changeX = Math.abs(panel_x - slot_x);
            var changeY = Math.abs(panel_y - slot_y);
            
            var crossingResult = checkEdge.crossing(slot, object.offset.left, object.offset.top, object.mouseX, object.mouseY, object.emPx);
            
            if(crossingResult && (changeX !== 0 || changeY !== 0)){
                movePanel(cardList, slot, panel, crossingResult, object.moveX, object.moveY);
            }
        };
    }]);