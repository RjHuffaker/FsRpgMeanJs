'use strict';

// Panel helper-functions
angular.module('move').factory('setPanelPosition', ['$rootScope', 'CoreVars', 'PanelUtils',
    function($rootScope, CoreVars, PanelUtils, DeckUtils){
        
        return function(cardList){
            var _panel = PanelUtils.getFirst(cardList).panel;
            var _last = PanelUtils.getLast(cardList).panel;
            var _x_current = 0;
            var _y_current = 0;
            var _continue = true;
            var _count = 0;
            
            while( _continue ){
                if( PanelUtils.panelHasNext(_panel) && _count < cardList.length ){
                    _panel.x_coord = _x_current;
                    _panel.y_coord = _y_current;
                    _count++;
                    
                    if(_panel.below.adjacent){
                        _y_current += 21;
                        _panel = PanelUtils.getPanel(cardList, _panel.below.adjacent);
                    } else if(_panel.below.overlap){
                        _y_current += 3;
                        _panel = PanelUtils.getPanel(cardList, _panel.below.overlap);
                    } else if(_panel.right.adjacent){
                        _x_current += 15;
                        _y_current = 0;
                        _panel = PanelUtils.getPanel(cardList, _panel.right.adjacent);
                    } else if(_panel.right.overlap){
                        _x_current += 3;
                        _y_current = 0;
                        _panel = PanelUtils.getPanel(cardList, _panel.right.overlap);
                    }
                } else if( !PanelUtils.panelHasNext(_panel) ){
                    _continue = false;
                    _last.x_coord = _x_current;
                    _last.y_coord = _y_current;
                } else if( _count >= cardList.length ){
                    _continue = false;
                    _last.x_coord = _x_current;
                    _last.y_coord = _y_current;
                    console.log('Sir, I believe we are experiencing an error.');
                }
            }
        };
    }]);