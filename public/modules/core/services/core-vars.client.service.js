'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('CoreVars', ['$rootScope', 'Bakery', 'CorePanel', 'CoreStack',
    function($rootScope, Bakery, CorePanel, CoreStack){
        var service = {};
        
        service.experience = 0;
        service.x_dim = 15;
        service.y_dim = 21;
        service.x_tab = 3;
        service.y_tab = 3;
        service.x_cover = 12;
        service.y_cover = 18;
        service.cardMoved = false;
        service.cardMoving = false;
        var moveSpeed = 800;
        var moveTimer;
        
        service.modalShown = false;
        service.diceBoxShown = false;
        service.modalDeckShown = false;
        
        // Set move booleans
        service.setCardMoving = function(){
            clearTimeout(moveTimer);
            service.cardMoving = true;
            service.cardMoved = true;
            moveTimer = setTimeout(function(){
                service.cardMoving = false;
                CoreStack.setDeckWidth(Bakery.resource.cardList);
            }, moveSpeed);
        };
        
        service.hideModal = function(){
            service.modalShown = false;
            service.diceBoxShown = false;
            service.modalDeckShown = false;
        };
        
        return service;
        
    }]);