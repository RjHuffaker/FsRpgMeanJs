'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('checkEdge', ['CoreVars',
    function(CoreVars){
        
        var service = {};
        
        service.crossing = function(panel, slotX, slotY, mouseX, mouseY, emPx){
            var _cover_px = 3 * emPx,
                _x_dim_px = panel.x_dim * emPx,
                _y_dim_px = panel.y_dim * emPx,
                _aboveEdge = slotY,
                _rightEdge = slotX + _x_dim_px,
                _belowEdge,
                _leftEdge;
            
            if(panel.below.overlap){
                _belowEdge = slotY + _cover_px;
            } else {
                _belowEdge = slotY + _y_dim_px;
            }
            
            if(panel.left.overlap){
                _leftEdge = slotX + _x_dim_px - _cover_px;
            } else {
                _leftEdge = slotX;
            }
            
            // console.log('testing '+panel._id+':  X:'+_leftEdge+'<'+mouseX+'<'+_rightEdge+'  Y:'+_aboveEdge+'<'+mouseY+'<'+_belowEdge);
            
            if(mouseX >= _leftEdge && mouseX <= _rightEdge && mouseY >= _aboveEdge && mouseY <= _belowEdge){
                var _above = mouseY - _aboveEdge;
                var _below = _belowEdge - mouseY;
                var _left = mouseX - _leftEdge;
                var _right = _rightEdge - mouseX;
                
                var _edges = [_above, _below, _left, _right],
                _closestEdge = Math.min.apply(Math.min, _edges),
                _edgeNames = ['above', 'below', 'left', 'right'],
                _edgeName = _edgeNames[_edges.indexOf(_closestEdge)];
                
            // console.log('crossing '+_edgeName+' edge of '+panel._id+':  X:'+_leftEdge+'<'+mouseX+'<'+_rightEdge+'  Y:'+_aboveEdge+'<'+mouseY+'<'+_belowEdge);
                
                return _edgeName;
            } else {
                return false;
            }
        };
        
        return service;
        
    }]);