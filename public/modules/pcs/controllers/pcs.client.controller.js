'use strict';

var pcsModule = angular.module('pcs');

// Pcs Controller
pcsModule.controller('PcsController', ['$scope', '$location', '$log', 'DataSRVC', 'Pcs', 'PcsCardDeck', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems',
	function($scope, $location, $log, DataSRVC, Pcs, PcsCardDeck, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems){
		
		this.dataSRVC = DataSRVC;
		
		this.pcs = Pcs;
		
		this.pcsCardDeck = PcsCardDeck;
		
		this.pcsCard1 = PcsCard1;
		
		this.pcsCard2 = PcsCard2;
		
		this.pcsCard3 = PcsCard3;
		
		this.pcsTraits = PcsTraits;
		
		this.pcsFeats = PcsFeats;
		
		this.pcsAugments = PcsAugments;
		
		this.pcsItems = PcsItems;
		
		this.newPc = function(){
			Pcs.addPc();
			Pcs.pcNew = true;
			Pcs.pcSaved = false;
		};
		
		this.openPc = function(pc){
			$location.path('pcs/'+pc._id+'/edit');
			Pcs.pcNew = false;
			Pcs.pcSaved = false;
		};
		
		this.savePc = function(){
			Pcs.editPc();
			Pcs.pcNew = false;
			Pcs.pcSaved = true;
		};
		
		this.exitPc = function(){
			if(Pcs.pcNew){
				Pcs.deletePc();
			}
			$location.path('pcs');
		};
		
		var shiftUp = function(event, object){
			PcsCardDeck.shiftUp(object.card);
		};
		
		var shiftDown = function(event, object){
			PcsCardDeck.shiftDown(object.card);
		};
		
		var shiftLeft = function(event, object){
			PcsCardDeck.shiftLeft(object.card);
		};
		
		var shiftRight = function(event, object){
			PcsCardDeck.shiftRight(object.card);
		};
		
		var toggle_X_Overlap = function(event, object){
			var _card = object.card;
			if(_card.x_index > 0){
				PcsCardDeck.toggle_X_Overlap(_card);
			}
		};
		
		var toggle_Y_Overlap = function(event, object){
			var _card = object.card;
			PcsCardDeck.toggle_Y_Overlap(_card);
		};
		
		$scope.$on('cardDeck:shiftUp', shiftUp);
		$scope.$on('cardDeck:shiftDown', shiftDown);
		$scope.$on('cardDeck:shiftLeft', shiftLeft);
		$scope.$on('cardDeck:shiftRight', shiftRight);
		$scope.$on('cardDeck:toggle_X_Overlap', toggle_X_Overlap);
		$scope.$on('cardDeck:toggle_Y_Overlap', toggle_Y_Overlap);
		
		$scope.$on('pcsCard1:updateStrPhy', function(event, object){
			PcsCard1.factorBlock(object._str, object._phy);
			PcsCard2.factorHealth();
			PcsCard2.factorStamina();
			PcsCard2.factorCarryingCapacity();
		});
		
		$scope.$on('pcsCard1:updateFleDex', function(event, object){
			PcsCard1.factorDodge(object._fle, object._dex);
		});
		
		$scope.$on('pcsCard1:updateAcuInt', function(event, object){
			PcsCard1.factorAlertness(object._acu, object._int);
		});
		
		$scope.$on('pcsCard1:updateWisCha', function(event, object){
			PcsCard1.factorTenacity(object._wis, object._cha);
		});
		
		//Watch for change in EXP input
		$scope.$watch('pcsCtrl.pcsCard2.EXP', function(newValue, oldValue){
			if(Pcs.pc.cards){
				PcsCard2.EXP = parseInt(newValue);
				Pcs.pc.cards[1].experience = parseInt(newValue);
			}
		});
		
		//Watch for change in experience
		$scope.$watch('pcsCtrl.pcs.pc.cards[1].experience', function(newValue, oldValue){
			if(Pcs.pc.cards){
				PcsCard2.factorExperience();
			}
		});
		
		//Watch for changes in level
		$scope.$watch('pcsCtrl.pcs.pc.cards[1].level', function(newValue, oldValue, scope){
			if(Pcs.pc.cards){
				PcsCard2.factorHealth();
				PcsCard2.factorStamina();
				PcsTraits.factorTraitLimit();
				PcsFeats.factorFeatLimit();
				PcsAugments.factorAugmentLimit();
			}
		});
		
}]);
