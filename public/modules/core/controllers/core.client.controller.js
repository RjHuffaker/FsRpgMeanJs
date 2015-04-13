'use strict';

// Core Controller
angular.module('core')
	.controller('CoreController', ['$location', '$scope', '$rootScope', '$window', 'Authentication', 'CardDeck', 'BREAD', 'DataSRVC', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems',
		function($location, $scope, $rootScope, $window, Authentication, CardDeck, BREAD, DataSRVC, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems) {
			// This provides Authentication context.
			$scope.authentication = Authentication;
			
			$scope.cardDeck = CardDeck;
			
			$scope.BREAD = BREAD;
			
			$scope.dataSRVC = DataSRVC;
			
			$scope.pcsCard1 = PcsCard1;
			
			$scope.pcsCard2 = PcsCard2;
			
			$scope.pcsCard3 = PcsCard3;
			
			$scope.pcsTraits = PcsTraits;
			
			$scope.pcsFeats = PcsFeats;
			
			$scope.pcsAugments = PcsAugments;
			
			$scope.pcsItems = PcsItems;
			
			$scope.modalShown = false;
			
			$scope.diceBoxShown = false;
			
			$scope.modalDeckShown = false;
			
			var pcNew = false;
			
			var fetchPcs = function(){
				BREAD.browsePcs();
			};
			
			var fetchCards = function(event, object){
				BREAD.browseCards(object.cardType);
			};
			
			var fetchDecks = function(event, object){
				BREAD.browseDecks(object.deckType, BREAD.resource);
			};
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if(!enable) return;
				$scope.$on('$destroy', onDestroy);
				$scope.$on('screenSize:onHeightChange', onHeightChange);
				$scope.$on('fetchPcs', fetchPcs);
				$scope.$on('fetchCards', fetchCards);
				$scope.$on('fetchDecks', fetchDecks);
				$scope.$on('ability:onPress', chooseAbility);
				$scope.$on('pcsCard1:updateAbility', updateAbility);
				$scope.$watch('pcsCard2.EXP', watchEXP);
				$scope.$watch('BREAD.resource.experience', watchExperience);
				$scope.$watch('BREAD.resource.level', watchLevel);
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
				BREAD.addPc();
				pcNew = true;
			};
			
			$scope.readPc = function(pc){
				BREAD.readPc(pc);
				pcNew = false;
			};
			
			$scope.readDeck = function(deck){
				BREAD.readDeck(deck);
			};
			
			$scope.savePc = function(pc){
				BREAD.editPc(pc);
				pcNew = false;
			};
			
			$scope.exitPc = function(){
				if(pcNew){
					BREAD.deletePc();
				}
				fetchPcs();
			};
			
			$scope.hideModal = function(){
				$scope.modalShown = false;
				$scope.diceBoxShown = false;
				$scope.modalDeckShown = false;
			};
			
			$scope.changeFeatureCard = function(card){
				$scope.modalShown = true;
				$scope.modalDeckShown = true;
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
			
			var chooseAbility = function(event, object){
				$scope.modalShown = true;
				$scope.diceBoxShown = true;
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
				$scope.modalShown = false;
				$scope.diceBoxShown = false;
			};
			
			//Watch for change in EXP input
			var watchEXP = function(newValue, oldValue){
				if(BREAD.resource && newValue !== oldValue){
					PcsCard2.EXP = parseInt(newValue);
					BREAD.resource.experience = parseInt(newValue);
				}
			};
			
			//Watch for change in experience
			var watchExperience = function(newValue, oldValue){
				if(BREAD.resource && newValue !== oldValue){
					PcsCard2.factorExperience();
					if(newValue !== PcsCard2.EXP){
						PcsCard2.EXP = newValue;
					}
				}
			};
			
			//Watch for changes in level
			var watchLevel = function(newValue, oldValue){
				if(BREAD.resource.abilities){
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