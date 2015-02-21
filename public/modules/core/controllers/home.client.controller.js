'use strict';

// Core Controller
angular.module('core')
	.controller('HomeController', ['$location', '$scope', '$rootScope', '$window', 'Authentication', 'CardDeck', 'HomeDemo', 'Pcs', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems', 'Cards',
		function($location, $scope, $rootScope, $window, Authentication, CardDeck, HomeDemo, Pcs, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems, Cards) {
			// This provides Authentication context.
			$scope.authentication = Authentication;
			
			$scope.cardDeck = CardDeck;
			
			$scope.pcs = Pcs;
			
			$scope.pcsCard1 = PcsCard1;
			
			$scope.pcsCard2 = PcsCard2;
			
			$scope.pcsCard3 = PcsCard3;
			
			$scope.pcsTraits = PcsTraits;
			
			$scope.pcsFeats = PcsFeats;
			
			$scope.pcsAugments = PcsAugments;
			
			$scope.pcsItems = PcsItems;
			
			$scope.cards = Cards;
			
			$scope.resource = {};
			
			$scope.cardList = [];
			
			$scope.pc = {};
			
			var fetchPcs = function(){
				$scope.resource = Pcs.browsePcs();
			};
			
			var fetchDeck = function(event, object){
				$scope.resource = Cards.browseCards(object.cardType);
				console.log($scope.resource);
			};
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if(!enable) return;
				$scope.$on('$destroy', onDestroy);
				$scope.$on('screenSize:onHeightChange', onHeightChange);
				$scope.$on('fetchPcs', fetchPcs);
				$scope.$on('fetchDeck', fetchDeck);
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
				$scope.windowScale = object.newScale;
				$scope.$digest();
			};
			
			$scope.newPc = function(){
				$scope.resource = {};
				$scope.resource = Pcs.addPc();
				Pcs.pcNew = true;
				Pcs.pcSaved = false;
			};
			
			$scope.readPc = function(pcId){
				$scope.resource = {};
				$scope.resource = Pcs.readPc(pcId);
			};
			
			$scope.savePc = function(){
				Pcs.editPc();
				Pcs.pcNew = false;
				Pcs.pcSaved = true;
			};
			
			$scope.exitPc = function(){
				if(Pcs.pcNew){
					$scope.resource = Pcs.deletePc();
				}
				fetchPcs();
			};
			
			$scope.changeFeatureCard = function(card){
				Pcs.modalShown = true;
				Pcs.modalDeckShown = true;
				PcsTraits.browseCards();
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
			
		}
	]);