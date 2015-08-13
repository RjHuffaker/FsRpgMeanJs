'use strict';

angular.module('move').factory('onCardMove', ['CoreVars', 'MoveHub', 'checkEdge',
    function(CoreVars, MoveHub, checkEdge){
        
        return function(object){
            
            if(CoreVars.cardMoving) return;
            
            var mouseX = object.mouseX;
            var mouseY = object.mouseY;
            
            var moveX = object.moveX;
            var moveY = object.moveY;
            
            var vectorX = Math.abs(object.moveX);
            var vectorY = Math.abs(object.moveY);
            
            var emPx = object.emPx;
            
            var slot = object.slot;
            var slot_x = slot.x_coord + slot.x_dim;
            var slot_y = slot.y_coord + slot.y_dim;
            var slot_x_px = object.offset.left;
            var slot_y_px = object.offset.top;
            var slot_x_overlap = slot.left.overlap || slot.right.overlap;
            var slot_y_overlap = slot.above.overlap || slot.below.overlap;
            
            var panel = object.panel;
            var panel_x = panel.x_coord + panel.x_dim;
            var panel_y = panel.y_coord + panel.y_dim;
            var panel_x_overlap = panel.left.overlap || panel.right.overlap;
            var panel_y_overlap = panel.above.overlap || panel.below.overlap;
            
            var changeX = Math.abs(panel_x - slot_x);
            var changeY = Math.abs(panel_y - slot_y);
            
            var crossingResult = checkEdge.crossing(slot, slot_x_px, slot_y_px, mouseX, mouseY, emPx);
            
            if(crossingResult && (changeX !== 0 || changeY !== 0)){
                
                if(crossingResult === 'above'){
                    // console.log('crossing above');
                    
                    if(vectorX > 0 && !slot_y_overlap && !slot_x_overlap && !panel_x_overlap){
                        console.log('cardPanel:moveDiagonalUp');
                        MoveHub.moveDiagonalUp(slot, panel);
                    } else if(changeX === 0 && !panel_y_overlap){
                        console.log('cardPanel:moveVertical');
                        MoveHub.moveVertical(slot, panel);
                    } else {
                        console.log('cardPanel:moveHorizontal');
                        MoveHub.moveHorizontal(slot, panel);
                    }
                } else if(crossingResult === 'below'){
                    // console.log('crossing below');
                    if(changeX > 0){
                        console.log('changeX: '+changeX);
                        console.log('cardPanel:moveDiagonalDown');
                        MoveHub.moveDiagonalDown(slot, panel);
                    } else if(changeX === 0 && !panel_y_overlap){
                        console.log('cardPanel:moveVertical');
                        MoveHub.moveVertical(slot, panel);
                    } else {
                        console.log('cardPanel:moveHorizontal');
                        MoveHub.moveHorizontal(slot, panel);
                    }
                } else if(crossingResult === 'left' || crossingResult === 'right'){
                    // console.log('crossing left or right');
                    if(vectorY * 2 > vectorX){
                        if(moveY < 0){
                            console.log('cardPanel:moveDiagonalUp');
                            MoveHub.moveDiagonalUp(slot, panel);
                        } else if(moveY > 0){
                            console.log('cardPanel:moveDiagonalDown');
                            MoveHub.moveDiagonalDown(slot, panel);
                        }
                    } else {
                        console.log('cardPanel:moveHorizontal');
                        MoveHub.moveHorizontal(slot, panel);
                    }
                }
            }
        };
    }]);