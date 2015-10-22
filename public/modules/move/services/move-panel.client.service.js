'use strict';

// Primary service used to resolve move actions
angular.module('move').factory('movePanel', ['$rootScope', 'CoreVars', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, PanelUtils, setPanelPosition){
        
        return function(cardList, slot, panel, nearest, moveX, moveY){
            
            if(CoreVars.cardMoving) return;
            
            if(slot._id === panel._id) return;
            
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
                // console.log('Switch Horizontal');
                if(panelStartOrder < slotStartOrder){
                    // console.log('Panel moving right ---->');
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    if(CoreVars.cardMoved.indexOf('left') > -1) return;
                    
                    CoreVars.setCardMoving('right');
                    
                    PanelUtils.mergeGap(slotEnd, panelStart);
                    PanelUtils.mergeGap(panelEnd, slotEndNext);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    
                } else if(slotStartOrder < panelStartOrder){
                    // console.log('Panel moving left <----');
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    if(CoreVars.cardMoved.indexOf('right') > -1) return;
                    
                    CoreVars.setCardMoving('left');
                    
                    PanelUtils.mergeGap(slotStartPrev, panelStart);
                    PanelUtils.mergeGap(panelEnd, slotStart);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    
                }
                
            } else if(nearest === 'higher'){
                // console.log('Move Over');
                
                if(panelEndOrder < slotStartOrder){
                    // console.log('Panel moving right --->');
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('left') > -1) return;
                    
                    CoreVars.setCardMoving('below');
                    CoreVars.setCardMoving('right');
                    
                    PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                    
                    if(slotStartOrder - panelEndOrder > 1){
                        // console.log('Panel moving right more than one slot --->');
                        PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                        PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    }
                } else if(slotStartOrder < panelEndOrder){
                    // console.log('Panel moving left <---');
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('right') > -1) return;
                    
                    CoreVars.setCardMoving('below');
                    CoreVars.setCardMoving('left');
                    
                    PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                    PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    
                }
            } else if(nearest === 'lower'){
                // console.log('Move Lower');
                if(panelStartOrder < slotEndOrder){
                    // console.log('Panel moving right ---->');
                    // if(CoreVars.cardMoved.indexOf('left') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    
                    CoreVars.setCardMoving('right');
                    CoreVars.setCardMoving('above');
                    
                    PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                    PanelUtils.mergeGap(panelEnd, slotEndNext);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    
                } else if(slotEndOrder < panelStartOrder){
                    // console.log('Panel moving left <----');
                    // if(CoreVars.cardMoved.indexOf('right') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    
                    CoreVars.setCardMoving('left');
                    CoreVars.setCardMoving('above');
                    
                    PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                    
                    if(panelStartOrder - slotEndOrder > 1){
                        // console.log('Panel moving left more than one slot <----');
                        PanelUtils.mergeGap(panelEnd, slotEndNext);
                        PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    }
                }
            } else if(nearest === 'above'){
                // console.log('console.log('Panel moving down');
                if(CoreVars.cardMoved.indexOf('above') > -1) return;
                
                CoreVars.setCardMoving('below');
                
                PanelUtils.mergeGap(panelStartPrev, slotStart);
                PanelUtils.mergeGap(panelEnd, slotEndNext);
                PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                
            } else if(nearest === 'below'){
                // console.log('Panel moving up');
                if(panelStartOrder < slotStartOrder){
                    // Panel unstacking to the right ---->
                    CoreVars.setCardMoving('right');
                    
                    if(slotStartOrder - panelEndOrder > 1){
                        // Panel unstacking to the right more than 1 card ---->
                        PanelUtils.setAdjacentHorizontal(panelEnd, slotStart);
                        PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                        PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    } else {
                        // Panel unstacking only 1 slot to the right ---->
                        PanelUtils.setAdjacentHorizontal(panelStartPrev, panelStart);
                    }
                    
                } else if(slotStartOrder < panelStartOrder){
                    // Panel unstacking to the left <----
                    CoreVars.setCardMoving('left');
                    
                    if(slotEndOrder - panelStartOrder > 1){
                        // Panel unstacking to the left more than 1 card <----
                        PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                        PanelUtils.setAdjacentHorizontal(slotEnd, panelStart);
                        PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                    } else {
                        // Panel unstacking only 1 slot to the left <----
                        PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                        PanelUtils.setAdjacentHorizontal(panelEnd, slotStart);
                        PanelUtils.setAdjacentHorizontal(slotEnd, panelEndNext);
                    }
                    
                }
                
            } else if(nearest === 'left'){
                console.log('move right ----> '+panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
                
                if(-moveX > moveY * 2){
                     console.log('Panel moving or stacking above right ---->');
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    if(CoreVars.cardMoved.indexOf('left') > -1) return;
                    
                    CoreVars.setCardMoving('above');
                    CoreVars.setCardMoving('right');
                    
                    if(-moveX > moveY / 2){
                         console.log('Moving above');
                        PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                    } else {
                         console.log('Stacking above');
                        PanelUtils.setOverlapVertical(panelEnd, slotStart);
                    }
                    
                    if(slotStartOrder - panelEndOrder > 1){
                         console.log('More than one slot --->');
                        PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                        PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    }
                } else if(moveX < moveY * 2){
                     console.log('Panel moving or stacking below right ---->');
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    if(CoreVars.cardMoved.indexOf('left') > -1) return;
                    
                    CoreVars.setCardMoving('below');
                    CoreVars.setCardMoving('right');
                    
                    if(moveX < moveY / 2){
                         console.log('Moving below');
                        PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                    } else {
                         console.log('Stacking below');
                        PanelUtils.setOverlapVertical(slotEnd, panelStart);
                    }
                    
                    PanelUtils.mergeGap(panelEnd, slotEndNext);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    
                } else {
                     console.log('Panel moving right ---->');
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    if(CoreVars.cardMoved.indexOf('left') > -1) return;
                    
                    CoreVars.setCardMoving('right');
                    
                    PanelUtils.setAdjacentHorizontal(slotEnd, panelStart);
                    
                    if(panelEndOrder - slotStartOrder > 1){
                        if(PanelUtils.hasNext(panelEnd)){
                            PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                        }
                    }
                }
                
            } else if(nearest === 'right'){
                console.log('move left <---- '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id+' <-- '+panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id);
                
                if(-moveX < moveY * 2){
                    // console.log('Panel stacking above left <----');
                    
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    if(CoreVars.cardMoved.indexOf('right') > -1) return;
                    
                    CoreVars.setCardMoving('above');
                    CoreVars.setCardMoving('left');
                    
                    if(-moveX < moveY / 2){
                        // console.log('Moving above');
                        PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                    } else {
                        // console.log('Stacking above');
                        PanelUtils.setOverlapVertical(slotEnd, panelStart);
                    }
                    
                    if(panelStartOrder - slotEndOrder > 1){
                        // console.log('More than one slot <----');
                        
                        PanelUtils.mergeGap(panelEnd, slotEndNext);
                        PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    }
                } else if(moveX > moveY * 2){
                    // console.log('Panel stacking below left <----');
                    
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    if(CoreVars.cardMoved.indexOf('right') > -1) return;
                    
                    CoreVars.setCardMoving('below');
                    CoreVars.setCardMoving('left');
                    
                    if(moveX > moveY / 2){
                        // console.log('Moving below');
                        PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                    } else {
                        // console.log('Stacking below');
                        PanelUtils.setOverlapVertical(panelEnd, slotStart);
                    }
                    
                    PanelUtils.mergeGap(slotStartPrev, panelStart);
                    PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                } else {
                    // console.log('Panel moving left <----');
                    if(CoreVars.cardMoved.indexOf('above') > -1) return;
                    if(CoreVars.cardMoved.indexOf('below') > -1) return;
                    if(CoreVars.cardMoved.indexOf('right') > -1) return;
                    
                    CoreVars.setCardMoving('left');
                    
                    if(panelEnd.below.adjacent){
                        PanelUtils.setAdjacentHorizontal(panelEnd, panelEndNext);
                    } else {
                        console.log('slotStartPrev: '+slotStartPrev._id+' panelStart: '+panelStart._id);
                        console.log('panelEnd: '+panelEnd._id+' slotStart: '+slotStart._id);
                        console.log('panelStartPrev: '+panelStartPrev._id+' panelEndNext: '+panelEndNext._id);
                        
                        PanelUtils.mergeGap(slotStartPrev, panelStart);
                        PanelUtils.mergeGap(panelEnd, slotStart);
                        PanelUtils.mergeGap(panelStartPrev, panelEndNext);
                    }
                }
            }
            
            setPanelPosition(cardList);
            
        };
        
    }]);