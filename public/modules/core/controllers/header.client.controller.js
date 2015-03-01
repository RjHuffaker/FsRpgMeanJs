'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', 'Authentication', 'Menus',
	function($rootScope, $scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
		
		$scope.fetchPcs = function(){
			$rootScope.$broadcast('fetchPcs');
		};
		
		$scope.fetchCards = function(cardType){
			$rootScope.$broadcast('fetchCards', {
				cardType: cardType
			});
		};
		
		$scope.fetchDecks = function(deckType){
			$rootScope.$broadcast('fetchDecks', {
				deckType: deckType
			});
		};
		
	}
]);