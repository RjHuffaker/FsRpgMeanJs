'use strict';

angular.module('pcs').factory('PcsBread', ['$stateParams', '$location', 'Authentication', '$resource', '$rootScope', 'Bakery', 'MoveStack', 'MovePanel', 'pcsDefaults', function($stateParams, $location, Authentication, $resource, $rootScope, Bakery, MoveStack, MovePanel, pcsDefaults){
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
            MoveStack.setCardList(Bakery.resource.cardList);
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
    service.delete = function(pc, resource){
        pc.$remove(function(response){
            MovePanel.removePanel(pc, resource.cardList);
            MovePanel.setDeckSize(resource);
            MovePanel.collapseDeck(pc, resource.cardList);
        });
    };
    
    return service;
    
}]);