'use strict';

var pcsModule = angular.module('pcs');

// Pcs Controller
pcsModule.controller('PcsCtrl', ['$scope', '$location', '$log', 'DataSRVC', 'Pcs', 'PcsCardDeck', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems',
	function($scope, $location, $log, DataSRVC, Pcs, PcsCardDeck, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems){
		
		$scope.dataSRVC = DataSRVC;
		
		$scope.pcs = Pcs;
		
		$scope.pcsCardDeck = PcsCardDeck;
		
		$scope.pcsCard1 = PcsCard1;
		
		$scope.pcsCard2 = PcsCard2;
		
		$scope.pcsCard3 = PcsCard3;
		
		$scope.pcsTraits = PcsTraits;
		
		$scope.pcsFeats = PcsFeats;
		
		$scope.pcsAugments = PcsAugments;
		
		$scope.pcsItems = PcsItems;
		
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
		
		var moveHorizontal = function(event, object){
			if((object.panel.y_overlap && object.panel.y_index === 0) || Pcs.pc.cards[Pcs.lowestCard(object.panel.x_index)].y_index === 0){
				PcsCardDeck.switchHorizontal(object.slot, object.panel);
			} else {
				PcsCardDeck.unstackCard(object.slot, object.panel);
			}
		};

		var moveDiagonalUp = function(event, object){
			if((object.panel.y_index === 0 && object.panel.y_overlap) || Pcs.pc.cards[Pcs.lowestCard(object.panel.x_index)].y_index === 0){
				PcsCardDeck.stackUnder(object.slot, object.panel);
			} else {
				PcsCardDeck.unstackCard(object.slot, object.panel);
			}
		};

		var moveDiagonalDown = function(event, object){
			if((object.panel.y_index === 0 && object.panel.y_overlap) || Pcs.pc.cards[Pcs.lowestCard(object.panel.x_index)].y_index === 0){
				PcsCardDeck.stackOver(object.slot, object.panel);
			} else {
				PcsCardDeck.unstackCard(object.slot, object.panel);
			}
		};
		
		var moveVertical = function(event, object){
			PcsCardDeck.switchVertical(object.slot, object.panel);
		};
		
		var unstackLeft = function(event, object){
			if(object.panel.y_index > 0){
				PcsCardDeck.unstackCard({x_index: -1}, object.panel);
			}
		};
		
		var unstackRight = function(event, object){
			if(object.panel.y_index > 0){
				var unstack_index = Pcs.pc.cards[Pcs.lastCard()].x_index + 1;
				PcsCardDeck.unstackCard({x_index: unstack_index}, object.panel);
			}
		};
		
		var toggleOverlap = function(event, object){
			PcsCardDeck.toggleOverlap(object.panel);
		};
		
		var onReleaseCard = function(event, object){
			PcsCardDeck.onReleaseCard(object.panel);
		};
		
		var onPressCard = function(event, object){
			PcsCardDeck.onPressCard(object.panel);
			$scope.$digest();
		};
		
		$scope.$on('cardSlot:moveHorizontal', moveHorizontal);
		$scope.$on('cardSlot:moveDiagonalUp', moveDiagonalUp);
		$scope.$on('cardSlot:moveDiagonalDown', moveDiagonalDown);
		$scope.$on('cardSlot:moveVertical', moveVertical);
		
		$scope.$on('cardDeck:unstackLeft', unstackLeft);
		$scope.$on('cardDeck:unstackRight', unstackRight);
		$scope.$on('cardPanel:toggleOverlap', toggleOverlap);
		
		$scope.$on('cardPanel:onPressCard', onPressCard);
		$scope.$on('cardPanel:onReleaseCard', onReleaseCard);
		
		
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
		$scope.$watch('pcsCard2.EXP', function(newValue, oldValue){
			if(Pcs.pc && newValue !== oldValue){
				PcsCard2.EXP = parseInt(newValue);
				Pcs.pc.experience = parseInt(newValue);
			}
		});
		
		//Watch for change in experience
		$scope.$watch('pcs.pc.experience', function(newValue, oldValue){
			if(Pcs.pc && newValue !== oldValue){
				PcsCard2.factorExperience();
				if(newValue !== PcsCard2.EXP){
					PcsCard2.EXP = newValue;
				}
			}
		});
		
		//Watch for changes in level
		$scope.$watch('pcs.pc.level', function(newValue, oldValue, scope){
			if(Pcs.pc.abilities){
				PcsCard2.factorHealth();
				PcsCard2.factorStamina();
				PcsTraits.factorTraitLimit();
				PcsFeats.factorFeatLimit();
				PcsAugments.factorAugmentLimit();
			}
		});
		
}]);
