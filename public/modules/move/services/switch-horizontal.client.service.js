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
                
                var leftWidth =  leftDimens.right - leftDimens.left;
                var rightWidth = rightDimens.right - rightDimens.left;
                var totalWidth = rightDimens.right - leftDimens.left;
                
                var outerLeft = PanelUtils.getPanel(cardList, leftLeft.left.adjacent);
                var outerRight = PanelUtils.getPanel(cardList, rightRight.right.adjacent);
                
                StackUtils.setRange(cardList, leftLeft._id, leftRight._id, function(_leftStack){
                    StackUtils.setRange(cardList, rightLeft._id, rightRight._id, function(_rightStack){
                        
                        if(outerLeft){
                            outerLeft.right.adjacent = rightLeft._id;
                            rightLeft.left.adjacent = outerLeft._id;
                        } else {
                            rightLeft.left.adjacent = null;
                        }
                        
                        if(outerRight){
                            outerRight.left.adjacent = leftRight._id;
                            leftRight.right.adjacent = outerRight._id;
                        } else {
                            leftRight.right.adjacent = null;
                        }
                        
                        for(var ib = 0; ib < _rightStack.length; ib++){
                            _rightStack[ib].x_coord -= totalWidth - rightWidth;
                            rightRight.right.adjacent = leftLeft._id;
                        }
                    });
                    
                    for(var ic = 0; ic < _leftStack.length; ic++){
                        _leftStack[ic].x_coord += totalWidth - leftWidth;
                        leftLeft.left.adjacent = rightRight._id;
                    }
                    console.log(cardList);
                });
                
                $rootScope.$digest();
            }
        };
        
    }]);