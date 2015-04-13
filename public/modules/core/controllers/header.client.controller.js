'use strict';

angular.module('core').controller('HeaderController', ['$document', '$rootScope', '$scope', 'Authentication', 'Menus',
	function($document, $rootScope, $scope, Authentication, Menus) {
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
		
		$scope.fetchPcs = function(){
			$rootScope.$broadcast('fetchPcs');
			$scope.isCollapsed = false;
		};
		
		$scope.fetchDecks = function(deckType){
			$rootScope.$broadcast('fetchDecks', {
				deckType: deckType
			});
			$scope.isCollapsed = false;
		};
		
	}
]);