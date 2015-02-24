'use strict';

// Cards controller
angular.module('cards').controller('CardsCtrl', ['$scope', '$location', '$log', '$rootScope', 'DataSRVC', 'CardDeck', 'Cards',
	function($scope, $location, $log, $rootScope, DataSRVC, CardDeck, Cards) {
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.cards = Cards;
		
		$scope.cardDeck = CardDeck;
		
		$scope.status = {
			isopen: false
		};
		
		$scope.toggled = function(open){
			$scope.status.isopen = open;
			$rootScope.$broadcast('CardsCtrl:onDropdown', {
				isOpen: $scope.status.isopen
			});
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$scope.$on('$destroy', onDestroy);
		};
		
		var onDestroy = function(){
			toggleListeners(false);
		};
		
		initialize();
	}
]);