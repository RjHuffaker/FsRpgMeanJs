'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchVertical', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            if(CoreVars.cardMoving) return;
            
            console.log('switchVertical');
            
            CoreVars.setCardMoving();
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id),
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id),
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id),
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id);
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id);
            var panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
                
            if(slotOrder < panelOrder){
                // Panel moving up <----
                console.log('panel moving up');
                
                if(slotStart.left.adjacent){
                    PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                } else if(slotStart.above.adjacent){
                    PanelUtils.setAdjacentVertical(slotStartPrev, panelStart);
                } else {
                    panelStart.above.adjacent = null;
                    panelStart.left.adjacent = null;
                }
                
                if(panelEnd.right.adjacent){
                    PanelUtils.setAdjacentHorizontal(slotEnd, panelEndNext);
                } else if(panelEnd.below.adjacent){
                    PanelUtils.setAdjacentVertical(slotEnd, panelEndNext);
                } else {
                    panelStart.below.adjacent = null;
                    panelStart.right.adjacent = null;
                }
                
                PanelUtils.setAdjacentVertical(panelEnd, slotStart);
                
            } else if(panelOrder < slotOrder){
                // Panel moving down ---->
                console.log('panel moving down');
                
                if(panelStart.left.adjacent){
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, slotStart);
                } else if(panelStart.above.adjacent){
                    PanelUtils.setAdjacentVertical(panelStartPrev, slotStart);
                }
                
                if(slotEnd.right.adjacent){
                    PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                } else if(slotEnd.below.adjacent){
                    PanelUtils.setAdjacentVertical(panelEnd, slotEndNext);
                }
                
                PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                
            }
            
            console.log('Panel: '+panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id);
            
            console.log('Slot: '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
            
        };
        
    }]);