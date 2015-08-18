'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('checkEdge', ['CoreVars', 'PanelUtils',
    function(CoreVars, PanelUtils){
        
        var service = {};
        
        service.crossing = function(panel, panelX, panelY, mouseX, mouseY, emPx){
            var _cover_px = 3 * emPx,
                _x_dim_px = panel.x_dim * emPx,
                _y_dim_px = panel.y_dim * emPx,
                _aboveEdge = panelY,
                _rightEdge = panelX + _x_dim_px,
                _belowEdge = panelY + _y_dim_px,
                _leftEdge = panelX;
            
            /*
            if(panel.below.overlap){
                _belowEdge = panelY + _cover_px;
            } else {
                _belowEdge = panelY + _y_dim_px;
            }
            
            if(panel.left.overlap){
                _leftEdge = panelX + _x_dim_px - _cover_px;
            } else {
                _leftEdge = panelX;
            }
            */
            
            if(mouseX >= _leftEdge && mouseX <= _rightEdge){
                
                if(mouseY >= _aboveEdge && mouseY <= _belowEdge){
                    var _above = mouseY - _aboveEdge,
                    _below = _belowEdge - mouseY,
                    _left = mouseX - _leftEdge,
                    _right = _rightEdge - mouseX;
                    
                    var _edges = [_above, _below, _left, _right],
                    _closestEdge = Math.min.apply(Math.min, _edges),
                    _edgeNames = ['above', 'below', 'left', 'right'],
                    _edgeName = _edgeNames[_edges.indexOf(_closestEdge)];
                    
                    return _edgeName;
                } else if(!PanelUtils.hasAbove(panel) && mouseY < _aboveEdge){
                    return 'higher';
                } else if(!PanelUtils.hasBelow(panel) && mouseY > _belowEdge){
                    return 'lower';
                } else {
                    return false;
                }
            } else {
                return false;
            }
            
        };
        
        return service;
        
    }]);