'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchHorizontal', ['$rootScope', 'CoreVars', 'PanelUtils', 'DeckUtils', 'StackUtils', 'setPanelPosition',
    function($rootScope, CoreVars, PanelUtils, DeckUtils, StackUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            console.log('switchHorizontal');
            
            CoreVars.setCardMoving();
            
            var slotLeft, slotRight;
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id);
            var panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
                
            if(slotOrder < panelOrder){
                // Panel moving left <----
                PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotStart);
                PanelUtils.setAdjacentHorizontal(slotEnd, panelEndNext);
                
            } else if(panelOrder < slotOrder){
                // Panel moving right ---->
                
                PanelUtils.setAdjacentHorizontal(panelStartPrev, slotStart);
                PanelUtils.setAdjacentHorizontal(slotEnd, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
            }
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
        };
        
    }]);