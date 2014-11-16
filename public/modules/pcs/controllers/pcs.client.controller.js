'use strict';

var pcsModule = angular.module('pcs');

// Pcs Controller
pcsModule.controller('PcsController', ['$scope', '$location', '$log', 'DataSRVC', 'PcsBreadSRVC', 'PcsDeckSRVC', 'Pc1SRVC',
	function($scope, $location, $log, DataSRVC, PcsBreadSRVC, PcsDeckSRVC, Pc1SRVC){
		
		this.dataSRVC = DataSRVC;
		
		this.pcsBreadSRVC = PcsBreadSRVC;
		
		this.pcsDeckSRVC = PcsDeckSRVC;
		
		this.pc1SRVC = Pc1SRVC;
		
		this.newPc = function(){
			PcsBreadSRVC.addPc();
			PcsBreadSRVC.pcNew = true;
			PcsBreadSRVC.pcSaved = false;
		};
		
		this.openPc = function(pc){
			$location.path('pcs/'+pc._id+'/edit');
			PcsBreadSRVC.pcNew = false;
			PcsBreadSRVC.pcSaved = false;
		};
		
		this.savePc = function(){
			PcsBreadSRVC.editPc();
			PcsBreadSRVC.pcNew = false;
			PcsBreadSRVC.pcSaved = true;
		};
		
		this.exitPc = function(){
			if(PcsBreadSRVC.pcNew){
				console.log('newpc');
				PcsBreadSRVC.deletePc();
			}
			$location.path('pcs');
		};
		
		var shiftLeft = function(event, object){
			PcsDeckSRVC.shiftLeft(object.index);
		};
		
		var shiftRight = function(event, object){
			PcsDeckSRVC.shiftRight(object.index);
		};
		
		var toggleOverlap = function(event, object){
			var _card = object.index;
			if(_card > 0){
				PcsDeckSRVC.toggleOverlap(object.index);
			}
		};
		
		$scope.$on('cardDeck:shiftLeft', shiftLeft);
		$scope.$on('cardDeck:shiftRight', shiftRight);
		$scope.$on('cardDeck:toggleOverlap', toggleOverlap);
		
}]);
