'use strict';

angular.module('pcs').factory('PcsBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'PanelUtils', 'StackUtils', 'DeckUtils', 'pcsDefaults', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, PanelUtils, StackUtils, DeckUtils, pcsDefaults){
    var service = {};
    
    //BROWSE
    service.browse = function(){
        Bakery.resource = {};
        Bakery.resource.cardList = [];
        Bakery.Pcs.query(function(response){
            response.unshift({
                panelType: 'playerOptions'
            });
            Bakery.resource.cardList = response;
            DeckUtils.setCardList(Bakery.resource.cardList);
        });
    };
    
    //READ
    service.read = function(pc) {
        Bakery.resource = Bakery.Pcs.get({
            pcId: pc._id
        });
    };
    
    //EDIT
    service.edit = function(pc) {
        pc.$update(function(response) {
            console.log(response);
        }, function(errorResponse) {
            this.error = errorResponse.data.message;
        });
    };
    
    //ADD
    service.add = function(){
        var pc = new Bakery.Pcs (
            pcsDefaults
        );

        pc.$save(function(response){
            Bakery.resource = response;
        });
    };
    
    //DELETE
    service.delete = function(resource, pc){
        var _pc_x = pc.x_coord;
        var _pc_y = pc.y_coord;
        pc.$remove(function(response){
            if(resource) PanelUtils.removePanel(resource.cardList, pc);
        }).then(function(response){
            if(resource) DeckUtils.setDeckSize(resource);
        }).then(function(response){
            if(resource) DeckUtils.collapseDeck(resource.cardList, { x_coord: _pc_x, y_coord: _pc_y });
        });
    };
    
    return service;
    
}]);