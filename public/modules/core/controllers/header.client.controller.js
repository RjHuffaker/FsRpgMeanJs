'use strict';

angular.module('core').controller('HeaderController', ['$document', '$rootScope', '$scope', 'Authentication', 'Menus', 'CardsBread', 'DecksBread', 'PcsBread', function($document, $rootScope, $scope, Authentication, Menus, CardsBread, DecksBread, PcsBread) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.toggleCollapsibleMenu = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapse the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
        $scope.isCollapsed = false;
    });
    
    $scope.browseDecks = function(param){
        DecksBread.browse(param);
        $scope.isCollapsed = false;
    };
    
    $scope.browseCampaigns = function(){
        console.log('stub');
    };
    
     $scope.browsePcs = function(){
        PcsBread.browse();
        $scope.isCollapsed = false;
    };
    
    $scope.browseNpcs = function(){
        console.log('stub');
    };
    
}]);