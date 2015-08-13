'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackOver', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
        //    if(slot.left.overlap || slot.right.overlap || panel.left.overlap || panel.right.overlap) return;
            
            console.log('stackOver');
            
            CoreVars.setCardMoving();
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
                
            var panelStartOrder = PanelUtils.getPanelOrder(cardList, panelStart._id),
                slotEndOrder = PanelUtils.getPanelOrder(cardList, slotEnd._id);
            
            if(panelOrder < slotOrder){
                // Panel moving right ---->
                PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                
            } else if(slotOrder < panelOrder){
                // Panel moving left <----
                PanelUtils.setAdjacentVertical(slotEnd, panelStart);
                
                if(panelStartOrder - slotEndOrder > 1){
                    // Panel moving left more than one card
                    PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                }
                
            }
            
            console.log('Panel: '+panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id);
            
            console.log('Slot: '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
        };
        
    }]);