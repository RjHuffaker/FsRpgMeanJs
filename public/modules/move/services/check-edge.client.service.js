'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('checkEdge', ['CoreVars',
    function(CoreVars){
        
        var service = {};
        
        service.crossing = function(panel, slotX, slotY, mouseX, mouseY){
            var leftEdge = panel.x_overlap ? slotX + CoreVars.x_cover_px : slotX;
            var rightEdge = slotX + CoreVars.x_dim_px;
            var topEdge = slotY;
            var bottomEdge = panel.y_overlap ? slotY + CoreVars.y_tab_px : slotY + CoreVars.y_dim_px;
            
        //  console.log('testing '+panel.name+':  X '+panel.x_overlap+':'+leftEdge+'>'+mouseX+'>'+rightEdge+'  Y '+panel.y_overlap+':'+topEdge+'>'+mouseY+'>'+bottomEdge);
            
            if(mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= topEdge && mouseY <= bottomEdge){
                var left = mouseX - leftEdge;
                var right = rightEdge - mouseX;
                var top = mouseY - topEdge;
                var bottom = bottomEdge - mouseY;
                
                var edges = [left, right, top, bottom],
                closestEdge = Math.min.apply(Math.min, edges),
                edgeNames = ['left', 'right', 'top', 'bottom'],
                edgeName = edgeNames[edges.indexOf(closestEdge)];
                
        //      console.log('crossing '+edgeName+' edge of '+panel.name+':  X '+panel.x_overlap+':'+leftEdge+'>'+mouseX+'>'+rightEdge+'  Y '+panel.y_overlap+':'+topEdge+'>'+mouseY+'>'+bottomEdge);
                
                return edgeName;
            } else {
                return false;
            }
        };
        
        return service;
        
    }]);