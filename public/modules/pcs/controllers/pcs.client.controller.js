'use strict';

var pcsModule = angular.module('pcs');

// Pcs Controller
pcsModule.controller('PcsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pcs', 'PcsBreadSRVC', '$log', 
	function($scope, $stateParams, $location, Authentication, Pcs, PcsBreadSRVC, $log) {
		this.authentication = Authentication;
		
		this.pcsBreadSRVC = PcsBreadSRVC;
		
		this.go = function(path){
			$location.path(path);
		};
		
		var shiftLeft = function(event, object){
			PcsBreadSRVC.shiftLeft(object.index);
		};
		
		var shiftRight = function(event, object){
			PcsBreadSRVC.shiftRight(object.index);
		};
		
		var toggleOverlap = function(event, object){
			var _card = object.index;
			if(_card > 0){
				PcsBreadSRVC.toggleOverlap(object.index);
			}
		};
		
		$scope.$on('cardDeck:shiftLeft', shiftLeft);
		$scope.$on('cardDeck:shiftRight', shiftRight);
		$scope.$on('cardDeck:toggleOverlap', toggleOverlap);
		
}]);
