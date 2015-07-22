'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchHorizontal', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'DeckUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, DeckUtils, StackUtils){
        
        return function(cardList, slot, panel){
            
            if(CoreVars.cardMoving) return;
            
            console.log('switchHorizontal: '+slot.x_coord+'/'+panel.x_coord);
            
            CoreVars.setCardMoving();
            
            var slotOrder = PanelUtils.getPanelOrder(cardList, slot._id);
            var panelOrder = PanelUtils.getPanelOrder(cardList, panel._id);
            
            var leftLeft, leftRight,
                rightLeft, rightRight;
                
            if(slotOrder < panelOrder){
                // Panel moving left <----
                leftLeft = StackUtils.getStackAbove(cardList, slot._id);
                leftRight = StackUtils.getStackAbove(cardList, panel._id).left.adjacent;
                leftRight = PanelUtils.getPanel(cardList, leftRight);
                rightLeft = StackUtils.getStackAbove(cardList, panel._id);
                rightRight = StackUtils.getStackBelow(cardList, panel._id);
            } else if(panelOrder < slotOrder){
                // Panel moving right ---->
                leftLeft = StackUtils.getStackAbove(cardList, panel._id);
                leftRight = StackUtils.getStackBelow(cardList, panel._id);
                rightLeft = StackUtils.getStackBelow(cardList, panel._id).right.adjacent;
                rightLeft = PanelUtils.getPanel(cardList, rightLeft);
                rightRight = StackUtils.getStackBelow(cardList, slot._id);
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
            
            StackUtils.setRange(cardList, leftLeft._id, leftRight._id, function(_leftRange){
                StackUtils.setRange(cardList, rightLeft._id, rightRight._id, function(_rightRange){
                    
                    outerLeft.right.adjacent = rightLeft._id;
                    rightLeft.left.adjacent = outerLeft._id;
                    
                    outerRight.left.adjacent = leftRight._id;
                    leftRight.right.adjacent = outerRight._id;
                    
                    rightRight.right.adjacent = leftLeft._id;
                    
                    for(var ib = 0; ib < _rightRange.length; ib++){
                        _rightRange[ib].x_coord -= totalWidth - rightWidth;
                    }
                });
                
                leftLeft.left.adjacent = rightRight._id;
                
                for(var ic = 0; ic < _leftRange.length; ic++){
                    _leftRange[ic].x_coord += totalWidth - leftWidth;
                }
            });
            
            $rootScope.$digest();
        };
        
    }]);