'use strict';

// Pcs Controller
angular.module('player')
	.controller('PcsCtrl', ['$scope', '$location', '$rootScope', '$window', 'DataSRVC', 'CardDeck', 'Pcs', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems',
		function($scope, $location, $rootScope, $window, DataSRVC, CardDeck, Pcs, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems){
			
			var _window = angular.element($window);
			
			$scope.windowHeight = 0;
			
			$scope.dataSRVC = DataSRVC;
			
			$scope.cardDeck = CardDeck;
			
			$scope.pcs = Pcs;
			
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
				$location.path('player/pcs/'+pc._id+'/edit');
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
				$location.path('player/pcs');
			};
			
			$scope.changeFeatureCard = function(card){
				Pcs.modalShown = true;
				Pcs.modalDeckShown = true;
				PcsTraits.browseCards();
			};
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if(!enable) return;
				$scope.$on('$destroy', onDestroy);
				$scope.$on('screenSize:onHeightChange', onHeightChange);
				$scope.$on('pcsCard1:updateAbility', updateAbility);
				$scope.$watch('pcsCard2.EXP', watchEXP);
				$scope.$watch('pcs.pc.experience', watchExperience);
				$scope.$watch('pcs.pc.level', watchLevel);
			};
			
			var onDestroy = function(){
				toggleListeners(false);
			};
			
			var onHeightChange = function(event, object){
				$scope.windowHeight = object.newHeight;
				$scope.$digest();
			};
			
	 		$scope.status = {
	 			isopen: false
	 		};
		 	
	 		$scope.toggled = function(open){
	 			$scope.status.isopen = open;
	 			$rootScope.$broadcast('CardsCtrl:onDropdown', {
	 				isOpen: $scope.status.isopen
	 			});
	 		};
			
			var updateAbility = function(event, object){
				var abilityPair = object.abilityPair;
				var ability1 = object.ability1;
				var ability2 = object.ability2;
				switch(abilityPair){
					case 1:
						PcsCard1.factorBlock(ability1, ability2);
						PcsCard2.factorHealth();
						PcsCard2.factorStamina();
						PcsCard2.factorCarryingCapacity();
						break;
					case 2:
						PcsCard1.factorDodge(ability1, ability2);
						break;
					case 3:
						PcsCard1.factorAlertness(ability1, ability2);
						break;
					case 4:
						PcsCard1.factorTenacity(ability1, ability2);
						break;
				}
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
