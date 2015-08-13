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
                var _start = PanelUtils.getStackStart(cardList, panelId);
                var _startPrev = PanelUtils.getPrev(cardList, _start._id).panel;
                
                CoreVars.setCardMoving();
                
                if(_curr.below.overlap && (nearest === 'above' || nearest === 'right')){
                    PanelUtils.setAdjacentVertical(_curr, _next);
                } else if(_curr.below.adjacent && !_start.left.overlap){
                    PanelUtils.setOverlapVertical(_curr, _next);
                }
                
                if(_start.left.overlap){
                    PanelUtils.setAdjacentHorizontal(_startPrev, _start);
                } else if(_start.left.adjacent){
                    if(!PanelUtils.hasBelow(_curr) || (nearest === 'below' || nearest === 'left')){
                        PanelUtils.setOverlapHorizontal(_startPrev, _start);
                    }
                }
                
                setPanelPosition(cardList);
                $rootScope.$digest();
                CoreVars.cardMoved = false;
            }
        };
        
    }]);