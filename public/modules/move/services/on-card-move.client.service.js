'use strict';

angular.module('move').factory('onCardMove', ['CoreVars', 'MoveHub', 'checkEdge',
    function(CoreVars, MoveHub, checkEdge){
        
        return function(object){
            if(!CoreVars.cardMoving){
                var mouseX = object.mouseX;
                var mouseY = object.mouseY;
                
                var moveX = object.moveX;
                var moveY = object.moveY;
                
                var vectorX = Math.abs(object.moveX);
                var vectorY = Math.abs(object.moveY);
                
                var slot = object.slot;
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_x_px = object.offset.left;
                var slot_y_px = object.offset.top;
                var slot_x_overlap = slot.x_overlap;
                var slot_y_overlap = slot.y_overlap;
                
                var panel = object.panel;
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_x_overlap = panel.x_overlap;
                var panel_y_overlap = panel.y_overlap;
                
                var changeX = Math.abs(panel_x - slot_x);
                var changeY = Math.abs(panel_y - slot_y);
                
                var crossingResult = checkEdge.crossing(slot, slot_x_px, slot_y_px, mouseX, mouseY);
                    
                if(crossingResult && (changeX !== 0 || changeY !== 0)){
            //        var crossingResult = checkEdge.crossing(slot, slot_x_px, slot_y_px, mouseX, mouseY);
                    
                    if(crossingResult === 'top'){
                        console.log('crossing top');
                        
                    //    if(vectorX > 0 && !slot_y_overlap && !slot_x_overlap && !panel_x_overlap){
                    //        console.log('cardPanel:moveDiagonalUp');
                    //        MoveHub.moveDiagonalUp(slot, panel);
                    //    } else if(changeX === 0 && !panel_y_overlap){
                    //        console.log('cardPanel:moveVertical');
                    //        MoveHub.moveVertical(slot, panel);
                    //    } else {
                    //        console.log('cardPanel:moveHorizontal');
                            MoveHub.moveHorizontal(slot, panel);
                    //    }
                    } else if(crossingResult === 'bottom'){
                        console.log('crossing bottom');
                        if(changeX > 0 && changeX <= CoreVars.x_dim_px){
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
                        console.log('crossing left or right');
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
            }
        };
    }]);