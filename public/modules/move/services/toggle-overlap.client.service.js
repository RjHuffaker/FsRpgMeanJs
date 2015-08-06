'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('toggleOverlap', ['$rootScope', 'CoreVars', 'PanelUtils', 'setPanelPosition',
    function($rootScope, CoreVars, PanelUtils, setPanelPosition){
        
        return function(cardList, panelId, nearest){
            if(!CoreVars.cardMoved && !CoreVars.cardMoving){
                
                console.log('toggleOverlap: '+nearest);
                
                var _curr = PanelUtils.getPanel(cardList, panelId);
                var _prev = PanelUtils.getPrev(cardList, panelId).panel;
                var _next = PanelUtils.getNext(cardList, panelId).panel;
                
                CoreVars.setCardMoving();
                
                if(nearest === 'top'){
                    if(_curr.below.overlap === _next._id && _next.above.overlap === _curr._id){
                        PanelUtils.setAdjacentVertical(_curr, _next);
                    }
                } else if(nearest === 'bottom'){
                    if(_curr.below.adjacent === _next._id && _next.above.adjacent === _curr._id){
                        PanelUtils.setOverlapVertical(_curr, _next);
                    }
                } else if(nearest === 'left'){
                    if(_curr.left.adjacent === _prev._id && _prev.right.adjacent === _curr._id){
                        PanelUtils.setOverlapHorizontal(_prev, _curr);
                    }
                } else if(nearest === 'right'){
                    if(_curr.left.overlap === _prev._id && _prev.right.overlap === _curr._id){
                        PanelUtils.setAdjacentHorizontal(_prev, _curr);
                    }
                }
                /*
                if(PanelUtils.panelHasLeft(_curr)){
                    if(_curr.left.overlap === _prev._id && _prev.right.overlap === _curr._id){
                        PanelUtils.setAdjacentHorizontal(_prev, _curr);
                    } else if(_curr.left.adjacent === _prev._id && _prev.right.adjacent === _curr._id){
                        PanelUtils.setOverlapHorizontal(_prev, _curr);
                    }
                }
                
                if(PanelUtils.panelHasBelow(_curr)){
                    if(_curr.below.overlap === _next._id && _next.above.overlap === _curr._id){
                        PanelUtils.setAdjacentVertical(_curr, _next);
                    } else if(_curr.below.adjacent === _next._id && _next.above.adjacent === _curr._id){
                        PanelUtils.setOverlapVertical(_curr, _next);
                    }
                }
                */
                setPanelPosition(cardList);
                $rootScope.$digest();
                CoreVars.cardMoved = false;
            }
        };
        
    }]);