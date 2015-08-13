'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchHorizontal', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', 'setPanelPosition',
    function($rootScope, CoreVars, PanelUtils, DeckUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            console.log('switchHorizontal');
            
            CoreVars.setCardMoving();
            
            var slotStart = PanelUtils.getRangeStart(cardList, slot._id),
                slotEnd = PanelUtils.getRangeEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getRangeStart(cardList, panel._id),
                panelEnd = PanelUtils.getRangeEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
            
            if(panelOrder < slotOrder){
                // Panel moving right ---->
                
                PanelUtils.setAdjacentHorizontal(slotEnd, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                
            } else if(slotOrder < panelOrder){
                // Panel moving left <----
                
                PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotStart);
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                
            }
            
            console.log('Panel: '+panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id);
            
            console.log('Slot: '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
        };
        
    }]);