'use strict';

var pcsModule = angular.module('pcs');

// Pcs Controller
pcsModule.controller('PcsCtrl', ['$scope', '$location', '$log', 'DataSRVC', 'CardDeck', 'Pcs', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems',
	function($scope, $location, $log, DataSRVC, CardDeck, Pcs, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems){
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.pcs = Pcs;
		
		$scope.pcsCard1 = PcsCard1;
		
		$scope.pcsCard2 = PcsCard2;
		
		$scope.pcsCard3 = PcsCard3;
		
		$scope.pcsTraits = PcsTraits;
		
		$scope.pcsFeats = PcsFeats;
		
		$scope.pcsAugments = PcsAugments;
		
		$scope.pcsItems = PcsItems;
		
		$scope.windowHeight = 0;
		
		$scope.windowScale = 0;
		
		$scope.newPc = function(){
			Pcs.addPc();
			Pcs.pcNew = true;
			Pcs.pcSaved = false;
		};
		
		$scope.openPc = function(pc){
			$location.path('pcs/'+pc._id+'/edit');
			Pcs.pcNew = false;
			Pcs.pcSaved = false;
		};
		
		$scope.savePc = function(){
			Pcs.editPc();
			Pcs.pcNew = false;
			Pcs.pcSaved = true;
		};
		
		$scope.exitPc = function(){
			if(Pcs.pcNew){
				Pcs.deletePc();
			}
			$location.path('pcs');
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$scope.$on('$destroy', onDestroy);
			$scope.$on('screenSize:onHeightChange', onHeightChange);
			$scope.$on('pcsCard1:updateStrPhy', updateStrPhy);
			$scope.$on('pcsCard1:updateFleDex', updateFleDex);
			$scope.$on('pcsCard1:updateAcuInt', updateAcuInt);
			$scope.$on('pcsCard1:updateWisCha', updateWisCha);
			$scope.$watch('pcsCard2.EXP', watchEXP);
			$scope.$watch('pcs.pc.experience', watchExperience);
			$scope.$watch('pcs.pc.level', watchLevel);
		};
		
		var onDestroy = function(){
			toggleListeners(false);
		};
		
		var onHeightChange = function(event, object){
			$scope.windowHeight = object.newHeight;
			$scope.windowScale = object.newScale;
		};
		
		var updateStrPhy = function(event, object){
			PcsCard1.factorBlock(object._str, object._phy);
			PcsCard2.factorHealth();
			PcsCard2.factorStamina();
			PcsCard2.factorCarryingCapacity();
		};
		
		var updateFleDex = function(event, object){
			PcsCard1.factorDodge(object._fle, object._dex);
		};
		
		var updateAcuInt = function(event, object){
			PcsCard1.factorAlertness(object._acu, object._int);
		};
		
		var updateWisCha = function(event, object){
			PcsCard1.factorTenacity(object._wis, object._cha);
		};
		
		//Watch for change in EXP input
		var watchEXP = function(newValue, oldValue){
			if(Pcs.pc && newValue !== oldValue){
				PcsCard2.EXP = parseInt(newValue);
				Pcs.pc.experience = parseInt(newValue);
			}
		};
		
		//Watch for change in experience
		var watchExperience = function(newValue, oldValue){
			if(Pcs.pc && newValue !== oldValue){
				PcsCard2.factorExperience();
				if(newValue !== PcsCard2.EXP){
					PcsCard2.EXP = newValue;
				}
			}
		};
		
		//Watch for changes in level
		var watchLevel = function(newValue, oldValue){
			if(Pcs.pc.abilities){
				PcsCard2.factorHealth();
				PcsCard2.factorStamina();
				PcsTraits.factorTraitLimit();
				PcsFeats.factorFeatLimit();
				PcsAugments.factorAugmentLimit();
			}
		};
		
		initialize();
		
}]);
