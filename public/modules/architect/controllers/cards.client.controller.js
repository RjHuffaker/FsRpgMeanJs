'use strict';

// Cards controller
angular.module('architect').controller('CardsCtrl', ['$scope', '$location', '$log', '$rootScope', 'DataSRVC', 'CardDeck', 'Cards', 'Socket',
	function($scope, $location, $log, $rootScope, DataSRVC, CardDeck, Cards, Socket) {
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.cards = Cards;
		
		$scope.cardDeck = CardDeck;
		
		$scope.$on('socket:trait.created', function(card) {
			console.log('Trait created(scope):');
			console.log(card);
		});
		
		$scope.$on('socket:trait.deleted', function(card) {
			console.log('Trait deleted(scope):');
			console.log(card);
		});
		
		
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