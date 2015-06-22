'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackUnder', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils){
        
        // Stack one card behind another and reposition deck to fill the gap
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving && !slot.leftId && !slot.rightId && !panel.leftId && !panel.rightId){
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_lowest_coord = PanelUtils.getLowestPanel(cardList, panel_x).panel.y_coord;
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var newColumn = panel_x > slot_x ? slot_x : slot_x - CoreVars.x_dim_em;
                
                panel.aboveId = slot._id;
                slot.belowId = panel._id;
                
                CoreVars.setCardMoving();
                for(var i = 0; i < cardList.length; i++){
                    var _current = cardList[i];
                    
                    if(!_current.dragging && _current.x_coord === slot_x){
                        _current.y_coord += panel_lowest_coord + CoreVars.y_tab_em;
                    }
                    if(_current.x_coord > panel_x){
                        _current.x_coord -= CoreVars.x_dim_em;
                    }
                    if(_current.dragging){
                        _current.x_coord = newColumn;
                    }
                }
                
                $rootScope.$digest();
            }
        };
        
    }]);