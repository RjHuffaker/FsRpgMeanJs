'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('unstackCard', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, Bakery, PanelUtils, setPanelPosition){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            console.log('unstackCard');
            
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
            
            if(slotOrder < panelOrder){
                PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                PanelUtils.setAdjacentHorizontal(slotEnd, panelStart);
                PanelUtils.setAdjacentHorizontal(panelEnd, slotEndNext);
                
            } else if(panelOrder < slotOrder){
                
                PanelUtils.setAdjacentHorizontal(panelEnd, slotStart);
                
                if(slotOrder - panelOrder === 1){
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelStart);
                }
                
                if(slotOrder - panelOrder > 1){
                    PanelUtils.setAdjacentHorizontal(panelStartPrev, panelEndNext);
                    PanelUtils.setAdjacentHorizontal(slotStartPrev, panelStart);
                }
            }
            
            
            
            
            console.log(panelStartPrev._id+' ['+panelStart._id+'-'+panelEnd._id+'] '+panelEndNext._id+' --> '+slotStartPrev._id+'['+slotStart._id+'-'+slotEnd._id+']'+slotEndNext._id);
            
            setPanelPosition(cardList);
            
            $rootScope.$digest();
            
            
            /*
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id),
                panelLeft = StackUtils.getStackAbove(cardList, panel._id),
                panelRight = StackUtils.getStackBelow(cardList, panel._id),
                slotLeft = PanelUtils.getPanel(cardList, panelRight.right.adjacent),
                slotRight = PanelUtils.getLast(cardList).panel;
            
            var nextAbove = PanelUtils.getPanel(cardList, panelLeft.above.adjacent),
                nextLeft = PanelUtils.getPanel(cardList, nextAbove.left.adjacent),
                nextRight = PanelUtils.getPanel(cardList, panelLeft.right.adjacent),
                panelStack = StackUtils.getStack(cardList, panel),
                slotStack = StackUtils.getStack(cardList, slot);
            
            var panelDimens = StackUtils.getRangeDimens(panelStack),
                slotDimens = StackUtils.getRangeDimens(slotStack);
            
            var panelHeight = panelDimens.below - panelDimens.above,
                panelWidth =  panelDimens.right - panelDimens.left,
                slotPanelDiff = slotDimens.above - panelDimens.above,
                slotHeight = slotDimens.below - slotDimens.above,
                slotWidth = slotDimens.right - slotDimens.left,
                totalWidth = slotDimens.right - panelDimens.left,
                totalHeight = slotDimens.below - panelDimens.above;
            
            console.log('SL: '+slotLeft._id+' SR: '+slotRight._id);
            console.log('PL: '+panelLeft._id+' PR: '+panelRight._id);
            console.log('SL: '+slotLeft._id+' SR: '+slotRight._id);
            console.log('NL: '+nextLeft._id+' NR: '+nextRight._id+' NA: '+nextAbove._id);
            console.log('Slot: '+slot._id+' Panel: '+panel._id);
            console.log('slotPanelDiff: '+slotPanelDiff);
            
            StackUtils.setRange(cardList, panelLeft._id, panelRight._id, function(_panelRange){
                StackUtils.setRange(cardList, slotLeft._id, slotRight._id, function(_slotRange){
                    for(var ia = 0; ia < _slotRange.length; ia++){
                        _slotRange[ia].x_coord += panelWidth;
                    }
                    
                });
                
                var shiftPanelLeft;
                
                if(slotOrder < panelOrder){
                    // Panel unstacking from right to left <---- (kinda works)
                    shiftPanelLeft = 0;
                    
                    nextAbove.x_coord += panelWidth;
                    
                    slot.right.adjacent = panelLeft._id;
                    nextAbove.left.adjacent = panelLeft._id;
                    nextAbove.right.adjacent = slotLeft._id;
                    nextAbove.below.adjacent = null;
                    panelLeft.left.adjacent = slot._id;
                    panelLeft.above.adjacent = null;
                    panelRight.right.adjacent = nextAbove._id;
                } else if(panelOrder < slotOrder){
                    // Panel unstacking from left to right ----> (sorta works)
                    shiftPanelLeft = CoreVars.x_dim_em;
                    
                    nextAbove.right.adjacent = panelLeft._id;
                    nextAbove.below.adjacent = null;
                    panelLeft.left.adjacent = nextAbove._id;
                    panelLeft.above.adjacent = null;
                }
                
                for(var i = 0; i < _panelRange.length; i++){
                    _panelRange[i].y_coord += slotPanelDiff;
                    _panelRange[i].x_coord += shiftPanelLeft;
                }
                
            });
            
            */
            
            $rootScope.$digest();
        };
        
    }]);