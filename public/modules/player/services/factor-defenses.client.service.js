'use strict';

// Factory-service for managing pc1 data.
angular.module('player').factory('factorDefenses', [
    function(){
        
        var service = {};
        
        service.factorBlock = function(resource){
            var dice_a = resource.abilities[0].dice;
            var dice_b = resource.abilities[1].dice;
            if (Number(dice_a.sides) > Number(dice_b.sides)){
                resource.block = '2' + dice_a.name;
            } else {
                resource.block = '2' + dice_b.name;
            }
        };
        
        service.factorDodge = function(resource){
            var dice_a = resource.abilities[2].dice;
            var dice_b = resource.abilities[3].dice;
            if (Number(dice_a.sides) > Number(dice_b.sides)){
                resource.dodge = '2' + dice_a.name;
            } else {
                resource.dodge = '2' + dice_b.name;
            }
        };
        
        service.factorAlertness = function(resource){
            var dice_a = resource.abilities[4].dice;
            var dice_b = resource.abilities[5].dice;
            if (Number(dice_a.sides) > Number(dice_b.sides)){
                resource.alertness = '2' + dice_a.name;
            } else {
                resource.alertness = '2' + dice_b.name;
            }
        };
        
        service.factorTenacity = function(resource){
            var dice_a = resource.abilities[6].dice;
            var dice_b = resource.abilities[7].dice;
            if (Number(dice_a.sides) > Number(dice_b.sides)){
                resource.tenacity = '2' + dice_a.name;
            } else {
                resource.tenacity = '2' + dice_b.name;
            }
        };
        
        return service;
    }]);