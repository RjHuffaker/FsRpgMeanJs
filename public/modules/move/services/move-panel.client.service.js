'use strict';

// Primary service used to resolve move actions
angular.module('move').factory('movePanel', ['$rootScope', 'CoreVars', 'PanelUtils', 'setPanelPosition', 'unstackCard',
    function($rootScope, CoreVars, PanelUtils, setPanelPosition, unstackCard){
        
        return function(cardList, slot, panel, nearest, moveX, moveY){
            
            if(CoreVars.cardMoving) return;
            
            var slotStart = PanelUtils.getClusterStart(cardList, slot._id),
                slotEnd = PanelUtils.getClusterEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id),
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id),
                panelStart = PanelUtils.getClusterStart(cardList, panel._id),
                panelEnd = PanelUtils.getClusterEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id),
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id);
                
            var panelStartOrder = PanelUtils.getPanelOrder(cardList, panelStart._id),
                panelEndOrder = PanelUtils.getPanelOrder(cardList, panelEnd._id),
                slotStartOrder = PanelUtils.getPanelOrder(cardList, slotStart._id),
                slotEndOrder = PanelUtils.getPanelOrder(cardList, slotEnd._id);
            
            var panel_x_overlap = panel.left.overlap || panel.right.overlap,
                panel_y_overlap = panel.above.overlap || panel.below.overlap,
                slot_x_overlap = slot.left.overlap || slot.right.overlap,
                slot_y_overlap = slot.above.overlap || slot.below.overlap;
            
            if(panel_x_overlap || slot_x_overlap){
                // Switch Horizontal
                if(panelStartOrder < slotStartOrder){
                    // Panel moving right ---->
                    
                    PanelUtils.mergeGap(slotEnd, panelStart);
                    PanelUtils.mergeGap(panelEnd, slotEndNext);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    
                } else if(slotStartOrder < panelStartOrder){
                    // Panel moving left <----
                    
                    PanelUtils.mergeGap(slotStartPrev, panelStart);
                    PanelUtils.mergeGap(panelEnd, slotStart);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    
                }
                
            } else if(nearest === 'higher'){
                // Move Over
                if(slotStartOrder < panelEndOrder){
                    // Panel moving left <---
                    PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                    PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    
                } else if(panelEndOrder < slotStartOrder){
                    // Panel moving right --->
                    PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                    
                    if(slotStartOrder - panelEndOrder > 1){
                        // Panel moving right more than one slot --->
                        PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                        PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    }
                }
            } else if(nearest === 'lower'){
                // Move Lower
                if(panelStartOrder < slotEndOrder){
                    // Panel moving right ---->
                    PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                    PanelUtils.mergeGap(panelEnd, slotEndNext);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    
                } else if(slotEndOrder < panelStartOrder){
                    // Panel moving left <----
                    PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                    
                    if(panelStartOrder - slotEndOrder > 1){
                        // Panel moving left more than one slot <----
                        PanelUtils.mergeGap(panelEnd, slotEndNext);
                        PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    }
                }
            } else if(nearest === 'above'){
                // Panel moving down
                
                PanelUtils.mergeGap(panelStartPrev, slotStart);
                PanelUtils.mergeGap(panelEnd, slotEndNext);
                PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                
                
            } else if(nearest === 'below'){
                // Panel moving up
                unstackCard(cardList, slot, panel);
                
            } else if(nearest === 'left'){
                if(-moveX > moveY * 2){
                    // Panel stacking above right ---->
                    if(CoreVars.cardMoved) return;
                    
                    PanelUtils.setOverlapVertical(panelEnd, slotStart);
                    
                    if(slotStartOrder - panelEndOrder > 1){
                        // Panel moving right more than one slot --->
                        PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                        PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    }
                } else if(moveX < moveY * 2){
                    // Panel stacking below right ---->
                    if(CoreVars.cardMoved) return;
                    
                    PanelUtils.setOverlapVertical(slotEnd, panelStart);
                    PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    
                } else {
                    // Panel moving right ---->
                    
                    PanelUtils.mergeGap(slotEnd, panelStart);
                    PanelUtils.mergeGap(panelEnd, slotEndNext);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                }
            } else if(nearest === 'right'){
                if(-moveX < moveY * 2){
                    // Panel stacking above left <----
                    
                    if(CoreVars.cardMoved) return;
                    
                    PanelUtils.setOverlapVertical(slotEnd, panelStart);
                    
                    if(panelStartOrder - slotEndOrder > 1){
                        // Panel moving left more than one slot <----
                        
                        PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                        PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    }
                } else if(moveX > moveY * 2){
                    // Panel stacking below left <----
                    
                    if(CoreVars.cardMoved) return;
                    
                    PanelUtils.setOverlapVertical(panelEnd, slotStart);
                    PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                } else {
                    // Panel moving left <----
                    
                    PanelUtils.mergeGap(slotStartPrev, panelStart);
                    PanelUtils.mergeGap(panelEnd, slotStart);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                }
            }
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            CoreVars.setCardMoving();
            
            setPanelPosition(cardList);
            
            
            
        };
        
    }]);