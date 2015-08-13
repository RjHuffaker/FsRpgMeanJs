'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackUnder', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            // if(!slot.left.overlap && !slot.right.overlap && !panel.left.overlap && !panel.right.overlap) return;
            
            console.log('stackUnder');
            
            CoreVars.setCardMoving();
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
            
            var slotStart = PanelUtils.getStackStart(cardList, slot._id),
                slotEnd = PanelUtils.getStackEnd(cardList, slot._id),
                slotStartPrev = PanelUtils.getPrev(cardList, slotStart._id).panel,
                slotEndNext = PanelUtils.getNext(cardList, slotEnd._id).panel,
                panelStart = PanelUtils.getStackStart(cardList, panel._id),
                panelEnd = PanelUtils.getStackEnd(cardList, panel._id),
                panelStartPrev = PanelUtils.getPrev(cardList, panelStart._id).panel,
                panelEndNext = PanelUtils.getNext(cardList, panelEnd._id).panel;
            
            PanelUtils.setOverlapVertical(panelEnd, slotStart);
            
            if(slotOrder < panelOrder || slotOrder - panelOrder > 1){
                // Panel moving left or right more than one card
                
                PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
            }
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
            
        };
        
    }]);