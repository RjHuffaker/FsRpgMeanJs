'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackOver', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            if(slot.left.overlap || slot.right.overlap || panel.left.overlap || panel.right.overlap) return;
            
            console.log('stackOver');
            
            CoreVars.setCardMoving();
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id),
                panelOrder = PanelUtils.getPanelOrder(cardList, panel._id),
                panelLeft = StackUtils.getStackAbove(cardList, panel._id),
                panelRight = StackUtils.getStackBelow(cardList, panel._id),
                slotLeft = PanelUtils.getPanel(cardList, panelRight.right.adjacent),
                slotRight = PanelUtils.getLast(cardList).panel;
            
            var nextLeft = PanelUtils.getPanel(cardList, panelLeft.left.adjacent),
                nextRight = PanelUtils.getPanel(cardList, slotLeft.right.adjacent),
                panelStack = StackUtils.getStack(cardList, panel),
                slotStack = StackUtils.getStack(cardList, slot);
            
            var panelDimens = StackUtils.getRangeDimens(panelStack),
                slotDimens = StackUtils.getRangeDimens(slotStack);
            
            var panelHeight = panelDimens.below - panelDimens.above,
                panelWidth = panelDimens.right - panelDimens.left,
                slotHeight = slotDimens.below - slotDimens.above,
                slotPanelDiff = slotDimens.below - panelDimens.above,
                slotWidth = slotDimens.right - slotDimens.left;
            
            console.log('SL: '+slotLeft._id+' SR: '+slotRight._id);
            console.log('PL: '+panelLeft._id+' PR: '+panelRight._id);
            console.log('SL: '+slotLeft._id+' SR: '+slotRight._id);
            
            console.log('Slot: '+slot._id+' Panel: '+panel._id);
            console.log('slotHeight: '+slotHeight);
            
            console.log(slotDimens);
            
            StackUtils.setRange(cardList, panelLeft._id, panelRight._id, function(_panelRange){
                StackUtils.setRange(cardList, slotLeft._id, slotRight._id, function(_slotRange){
                    for(var ia = 0; ia < _slotRange.length; ia++){
                        _slotRange[ia].x_coord -= panelWidth;
                    }
                    
                });
                
                var shiftLeft;
                
                if(slotOrder < panelOrder){
                    // Panel stacking from right to left <----
                    shiftLeft = CoreVars.x_dim_em;
                    
                    nextLeft.right.adjacent = null;
                    nextLeft.below.adjacent = panelLeft._id;
                    panelLeft.left.adjacent = null;
                    panelLeft.above.adjacent = nextLeft._id;
                } else if(panelOrder < slotOrder){
                    // Panel stacking from left to right ---->
                    shiftLeft = 0;
                    
                    nextLeft.right.adjacent = slotLeft._id;
                    panelLeft.above.adjacent = slotLeft._id;
                    panelRight.right.adjacent = nextRight._id;
                    panelLeft.left.adjacent = null;
                    
                    nextRight.left.adjacent = panelRight._id;
                    slotLeft.below.adjacent = panelLeft._id;
                    slotLeft.left.adjacent = nextLeft._id;
                    slotLeft.right.adjacent = null;
                }
                
                for(var ib = 0; ib < _panelRange.length; ib++){
                    _panelRange[ib].y_coord += slotPanelDiff;
                    _panelRange[ib].x_coord -= shiftLeft;
                }
                
            });
            
            $rootScope.$digest();
        };
        
    }]);