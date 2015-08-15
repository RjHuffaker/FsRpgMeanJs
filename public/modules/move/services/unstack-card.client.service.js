'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('unstackCard', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            console.log('unstackCard');
            
            CoreVars.setCardMoving();
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slotStart._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panelEnd._id);
            
            if(panelOrder < slotOrder){
                // Panel unstacking to the right ---->
                if(slotOrder - panelOrder > 1){
                    // Panel unstacking to the right more than 1 card ---->
                    PanelUtils.setAdjacentHorizontal(panelEnd, slotStart);
                    PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                } else {
                    // Panel unstacking only 1 slot to the right ---->
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelStart);
                }
                
            } else if(slotOrder < panelOrder){
                // Panel unstacking to the left <----
                
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                PanelUtils.setAdjacentHorizontal(slotEnd, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                
            }
            
            console.log('Panel: '+panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id);
            
            console.log('Slot: '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
        };
        
    }]);