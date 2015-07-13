'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchHorizontal', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'DeckUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, DeckUtils, StackUtils){
        
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving){
                console.log('switchHorizontal: '+slot.x_coord+'/'+panel.x_coord);
                
                CoreVars.setCardMoving();
                
                var slotStack = StackUtils.getStack(cardList, slot);
                var panelStack = StackUtils.getStack(cardList, panel);
                
                var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id);
                var panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
                
                // Refactor to use slotId and panelId.
                // Remove x/y_coord dependence.
                
                var leftLeft, leftRight,
                    rightLeft, rightRight;
                    
                if(slotOrder < panelOrder){
                    // Panel moving left <----
                    leftLeft = StackUtils.getStackBottom(cardList, slot._id);
                    leftRight = StackUtils.getStackBottom(cardList, panel._id).left.adjacent;
                    leftRight = PanelUtils.getPanel(cardList, leftRight);
                    rightLeft = StackUtils.getStackBottom(cardList, panel._id);
                    rightRight = StackUtils.getStackTop(cardList, panel._id);
                } else if(panelOrder < slotOrder){
                    // Panel moving right ---->
                    leftLeft = StackUtils.getStackBottom(cardList, panel._id);
                    leftRight = StackUtils.getStackTop(cardList, panel._id);
                    rightLeft = StackUtils.getStackTop(cardList, panel._id).right.adjacent;
                    rightLeft = PanelUtils.getPanel(cardList, rightLeft);
                    rightRight = StackUtils.getStackTop(cardList, slot._id);
                }
                
                var leftRange = StackUtils.getRange(cardList, leftLeft._id, leftRight._id);
                var rightRange = StackUtils.getRange(cardList, rightLeft._id, rightRight._id);
                
                var leftDimens = StackUtils.getRangeDimens(leftRange);
                var rightDimens = StackUtils.getRangeDimens(rightRange);
                
                console.log('LL: '+leftDimens.left+' / LR: '+leftDimens.right+' | RL: '+rightDimens.left+' / RR: '+rightDimens.right);
                
                var leftWidth =  leftDimens.right - leftDimens.left;
                var rightWidth = rightDimens.right - rightDimens.left;
                var totalWidth = rightDimens.right - leftDimens.left;
                
                console.log('LW: '+leftWidth+' + RW: '+rightWidth+' = TW: '+totalWidth);
                
                StackUtils.setRange(cardList, leftLeft._id, leftRight._id, function(_leftStack){
                    StackUtils.setRange(cardList, rightLeft._id, rightRight._id, function(_rightStack){
                        for(var ib = 0; ib < _rightStack.length; ib++){
                            _rightStack[ib].x_coord -= totalWidth - rightWidth;
                            rightLeft.left.adjacent = leftLeft.left.adjacent;
                            rightRight.right.adjacent = leftLeft._id;
                        }
                    });
                    for(var ic = 0; ic < _leftStack.length; ic++){
                        _leftStack[ic].x_coord += totalWidth - leftWidth;
                        leftLeft.left.adjacent = rightLeft._id;
                        leftRight.right.adjacent = rightRight.right.adjacent;
                    }
                });
                
                $rootScope.$digest();
            }
        };
        
    }]);