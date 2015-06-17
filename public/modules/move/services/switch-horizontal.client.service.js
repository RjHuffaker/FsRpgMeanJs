'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('switchHorizontal', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'DeckUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, DeckUtils, StackUtils){
        
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving){
                console.log('switchHorizontal');
                
                CoreVars.setCardMoving();
                
                var slotStack = StackUtils.getStack(cardList, slot);
                var panelStack = StackUtils.getStack(cardList, panel);
                
                var leftEdge, rightEdge,
                    leftLeft, rightLeft,
                    leftRight, rightRight,
                    leftPanel, rightPanel, 
                    leftStack = [], rightStack = [];
                    
                var slotDimens = StackUtils.getStackDimens(cardList, slot);
                var panelDimens = StackUtils.getStackDimens(cardList, panel);
                
                if(slot.x_coord < panel.x_coord){
                    // Panel moving left <----
                    leftPanel = slot;
                    rightPanel = panel;
                    leftLeft = slotDimens.left;
                    leftRight = panelDimens.left;
                    rightLeft = panelDimens.left;
                    rightRight = panelDimens.right + CoreVars.x_dim_em;
                    leftStack = StackUtils.getRange(cardList, leftEdge, rightEdge);
                    rightStack = StackUtils.getStack(cardList, slot);
                } else if(panel.x_coord < slot.x_coord){
                    // Panel moving right ---->
                    leftPanel = panel;
                    rightPanel = slot;
                    leftLeft = panelDimens.left;
                    leftRight = panelDimens.right + CoreVars.x_dim_em;
                    rightLeft = panelDimens.right + CoreVars.x_dim_em;
                    rightRight = slotDimens.right + CoreVars.x_dim_em;
                    leftStack = StackUtils.getStack(cardList, panel);
                    rightStack = StackUtils.getRange(cardList, leftEdge, rightEdge);
                }
                
                console.log('LL: '+leftLeft+' / LR: '+leftRight+' | RL: '+rightLeft+' / RR: '+rightRight);
                
                var leftWidth =  leftRight - leftLeft;
                var rightWidth = rightRight - rightLeft;
                var totalWidth = rightRight - leftLeft;
                
                console.log('LW: '+leftWidth+' + RW: '+rightWidth+' = TW: '+totalWidth);
                
                StackUtils.setRange(cardList, leftLeft, leftRight, function(_leftStack){
                    StackUtils.setRange(cardList, rightLeft, rightRight, function(_rightStack){
                        for(var ib = 0; ib < _rightStack.length; ib++){
                            _rightStack[ib].x_coord -= totalWidth - rightWidth;
                        }
                    });
                    console.log(_leftStack);
                    for(var ic = 0; ic < _leftStack.length; ic++){
                        _leftStack[ic].x_coord += totalWidth - leftWidth;
                    }
                });
                
                $rootScope.$digest();
            }
        };
        
    }]);