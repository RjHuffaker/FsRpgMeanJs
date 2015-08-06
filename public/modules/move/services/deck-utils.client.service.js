'use strict';

// Stack helper-functions
angular.module('move').factory('DeckUtils', ['$rootScope', 'CoreVars', 'PanelUtils', function($rootScope, CoreVars, PanelUtils) {
    
    var service = {};
    
    service.getRefArray = function(cardList){
        var _first = PanelUtils.getFirst(cardList);
        var _index = _first.index;
        var _panel = _first.panel;
        var _refArray = [_index];
        
        if(!_panel){
            console.log(_refArray);
        }
        
        while(_panel.below.adjacent || _panel.below.overlap || _panel.right.adjacent || _panel.right.overlap){
            if(_panel.below.adjacent){
                _index = PanelUtils.getPanelIndex(cardList, _panel.below.adjacent);
            } else if(_panel.below.overlap){
                _index = PanelUtils.getPanelIndex(cardList, _panel.below.overlap);
            } else if(_panel.right.adjacent){
                _index = PanelUtils.getPanelIndex(cardList, _panel.right.adjacent);
            } else if(_panel.right.overlap){
                _index = PanelUtils.getPanelIndex(cardList, _panel.right.overlap);
            }
            
            _refArray.push(_index);
            _panel = cardList[_index];
        }
        
        return _refArray;
    };
    
    service.setCardList = function(cardList){
        for(var i = 0; i < cardList.length; i++){
            var _previous = cardList[i-1] || null;
            var _current = cardList[i];
            var _next = cardList[i+1] || null;
            
            _current.x_coord = i * 15;
            _current.y_coord = 0;
            _current.dragging = false;
            _current.locked = false;
            _current.above = { adjacent: null, overlap: null };
            _current.below = { adjacent: null, overlap: null };
            _current.left = { adjacent: null, overlap: null };
            _current.right = { adjacent: null, overlap: null };
            if(_previous) _current.left.adjacent = _previous._id;
            if(_next) _current.right.adjacent = _next._id;
        }
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.expandDeck = function(cardList, panel){
        var panel_x_coord = panel.x_coord;
        var panel_y_coord = panel.y_coord;
        
        for(var i = 0; i < cardList.length; i++){
            var slot = cardList[i];
            
            var slotData = PanelUtils.getPanelData(slot);
            if (slot !== panel && slot.x_coord >= panel_x_coord){
                slot.x_coord += 15;
                slotData.cardNumber++;
            }
        }
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.collapseDeck = function(cardList, panel){
        
        var _refArray = service.getRefArray(cardList);
        var _prev = PanelUtils.getPrev(cardList, panel._id);
        var _next = PanelUtils.getNext(cardList, panel._id);
        var _prevPanel = _prev.panel;
        var _nextPanel = _next.panel;
        var _prevIndex = _prev.index;
        var _nextIndex = _next.index;
        
        if(panel.above.adjacent || panel.above.overlap){
            if(panel.below.adjacent || panel.below.overlap){
                _prevPanel.below = panel.below;
                _nextPanel.above = panel.above;
            } else if(panel.right.adjacent || panel.right.overlap){
                _prevPanel.below = panel.right;
                _nextPanel.left = panel.above;
                _nextPanel.above = { adjacent: null, overlap: null };
            }
        } else if(panel.below.adjacent || panel.below.overlap){
            
            
            
        } else if(panel.left.adjacent || panel.left.overlap){
            if(panel.below.adjacent || panel.below.overlap){
                _prevPanel.right = panel.below;
                _nextPanel.above = panel.left;
            } else if(panel.right.adjacent || panel.right.overlap){
                _prevPanel.right = panel.right;
                _nextPanel.left = panel.left;
                _nextPanel.above = { adjacent: null, overlap: null };
            }
        } else if(panel.right.adjacent || panel.right.overlap){
            
            
            
        }
        
        
        
        if(panel.below.adjacent || panel.below.overlap){
            var _belowPanel = panel;
            while(_belowPanel.below.adjacent || _belowPanel.below.overlap){
                if(_belowPanel.below.adjacent){
                    _belowPanel = PanelUtils.getPanel(cardList, _belowPanel.below.adjacent);
                    _belowPanel.y_coord -= 21;
                } else if(_belowPanel.below.overlap){
                    _belowPanel = PanelUtils.getPanel(cardList, _belowPanel.below.overlap);
                    _belowPanel.y_coord -= 3;
                }
            }
        } else if(panel.right.adjacent || panel.right.overlap){
            var _rightPanel = panel;
            while(_rightPanel.right.adjacent || _rightPanel.right.overlap){
                if(_rightPanel.right.adjacent){
                    _rightPanel = PanelUtils.getPanel(cardList, _rightPanel.right.adjacent);
                    _rightPanel.x_coord -= 15;
                } else if(_rightPanel.right.overlap){
                    _rightPanel = PanelUtils.getPanel(cardList, _rightPanel.right.overlap);
                    _rightPanel.x_coord -= 3;
                }
            }
        }
        
        for(var i = 0; i < _refArray.length; i++){
            var _panel = cardList[_refArray[i]];
            var _panelData = PanelUtils.getPanelData(_panel);
            
            if(_panelData) _panelData.deckSize--;
            
            if(i >= _nextIndex){
                if(_panelData) _panelData.cardNumber--;
            }
        }
        
        $rootScope.$broadcast('cardPanel:onReleaseCard');
    };
    
    service.setDeckSize = function(resource){
        var _length = resource.cardList.length - 1;
        resource.deckSize = _length;
        for(var i = 0; i < resource.cardList.length; i++){
            var panel = resource.cardList[i];
            var panelData = PanelUtils.getPanelData(panel);
            panelData.deckSize = _length;
        }
    };
    
    service.getDeckWidth = function(cardList){
        var lastPanel = PanelUtils.getLast(cardList);
        return lastPanel.panel.x_coord + 15;
    };
    
    service.setDeckWidth = function(cardList){
        var _deckWidth = service.getDeckWidth(cardList);
        $rootScope.$broadcast('DeckUtils:setDeckWidth', {
            deckWidth: _deckWidth
        });
    };
    
    return service;
}]);