'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('CoreVars', ['$rootScope',
    function($rootScope){
        
        var service = {};
        
        service.windowHeight = 0;
        
        service.experience = 0;
        service.x_dim_em = 15;
        service.y_dim_em = 21;
        service.x_tab_em = 3;
        service.y_tab_em = 3;
        service.x_cover_em = 12;
        service.y_cover_em = 18;
        
        service.x_dim_px = 240;
        service.y_dim_px = 336;
        service.x_tab_px = 48;
        service.y_tab_px = 48;
        service.x_cover_px = 144;
        service.y_cover_px = 192;
        
        service.cardMoved = false;
        service.cardMoving = false;
        var moveTimer;
        
        service.modalShown = false;
        service.diceBoxShown = false;
        service.modalDeckShown = false;
        
        $rootScope.$on('screenSize:onHeightChange', function(event, object){
            service.windowHeight = object.newHeight;
        });
        
        service.setCardMoving = function(){
            clearTimeout(moveTimer);
            service.cardMoving = true;
            service.cardMoved = true;
            moveTimer = setTimeout(function(){
                service.cardMoving = false;
                $rootScope.$broadcast('CoreVars:getDeckWidth');
            }, 800);
        };
        
        service.hideModal = function(){
            service.modalShown = false;
            service.diceBoxShown = false;
            service.modalDeckShown = false;
        };
        
        return service;
        
    }]);