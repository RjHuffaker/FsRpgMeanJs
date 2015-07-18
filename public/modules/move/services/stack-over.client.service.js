'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackOver', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils){
        
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving && !slot.left.overlap && !slot.right.overlap && !panel.left.overlap && !panel.right.overlap){
                console.log('stackOver');
                
                CoreVars.setCardMoving();
                
                var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id);
                var panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
                
                var rightLeft, rightRight,
                    leftLeft = StackUtils.getStackBottom(cardList, panel._id),
                    leftRight = StackUtils.getStackTop(cardList, panel._id);
                
                if(leftRight.right.adjacent){
                    rightLeft = PanelUtils.getPanel(cardList, leftRight.right.adjacent);
                    rightRight = PanelUtils.getLast(cardList).panel;
                } else {
                    rightLeft = CoreVars.nullPanel;
                    rightRight = CoreVars.nullPanel;
                }
                
                var leftRange = StackUtils.getRange(cardList, leftLeft._id, leftRight._id);
                var rightRange = StackUtils.getRange(cardList, rightLeft._id, rightRight._id);
                
                var leftDimens = StackUtils.getRangeDimens(leftRange);
                var rightDimens = StackUtils.getRangeDimens(rightRange);
                
                var leftHeight = leftDimens.above - leftDimens.below;
                var leftWidth =  leftDimens.right - leftDimens.left;
                
                var rightHeight = rightDimens.above - rightDimens.below;
                var rightWidth = rightDimens.right - rightDimens.left;
                
                var totalWidth = rightDimens.right - leftDimens.left;
                var totalHeight = rightDimens.above - leftDimens.below;
                
                console.log('LW: '+leftWidth+' LH: '+leftHeight);
                console.log('RW: '+rightWidth+' RH: '+rightHeight);
                
                var outerLeft = PanelUtils.getPanel(cardList, leftLeft.left.adjacent);
                var outerRight = PanelUtils.getPanel(cardList, rightLeft.right.adjacent);
                
                StackUtils.setRange(cardList, leftLeft._id, leftRight._id, function(_leftRange){
                    StackUtils.setRange(cardList, rightLeft._id, rightRight._id, function(_rightRange){
                        for(var ia = 0; ia < _rightRange.length; ia++){
                            _rightRange[ia].x_coord -= leftWidth;
                        }
                        
                    });
                    
                    var shiftLeft;
                    
                    if(slotOrder < panelOrder){
                        // Panel stacking from right to left <----
                        shiftLeft = CoreVars.x_dim_em;
                        
                        outerLeft.right.adjacent = null;
                        outerLeft.above.adjacent = leftLeft._id;
                        leftLeft.left.adjacent = null;
                        leftLeft.below.adjacent = outerLeft._id;
                    } else if(panelOrder < slotOrder){
                        // Panel stacking from left to right ---->
                        shiftLeft = 0;
                        
                        outerLeft.right.adjacent = rightLeft._id;
                        rightLeft.left.adjacent = outerLeft._id;
                        rightLeft.above.adjacent = leftLeft._id;
                        leftLeft.left.adjacent = null;
                        leftLeft.below.adjacent = rightLeft._id;
                        leftRight.right.adjacent = outerRight._id;
                        outerRight.left.adjacent = leftRight._id;
                    }
                    
                    for(var i = 0; i < _leftRange.length; i++){
                        _leftRange[i].y_coord += rightHeight;
                        _leftRange[i].x_coord -= shiftLeft;
                    }
                    
                });
                
                $rootScope.$digest();
            }
        };
        
    }]);