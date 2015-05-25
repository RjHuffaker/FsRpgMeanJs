'use strict';

// Core Controller
angular.module('core')
	.controller('CoreController', ['$location', '$scope', '$rootScope', '$window', 'Authentication', 'Bakery', 'CardsBread', 'DecksBread', 'PcsBread', 'DataSRVC', 'PcsCard1', 'PcsCard2', 'PcsCard3', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems', 'Architect', 'Player', 'CoreVars',
		function($location, $scope, $rootScope, $window, Authentication, Bakery, CardsBread, DecksBread, PcsBread, DataSRVC, PcsCard1, PcsCard2, PcsCard3, PcsTraits, PcsFeats, PcsAugments, PcsItems, Architect, Player, CoreVars) {
			
			// This provides Authentication context.
			$scope.authentication = Authentication;
			
			$scope.Bakery = Bakery;
            
			$scope.dataSRVC = DataSRVC;
			
			$scope.pcsCard1 = PcsCard1;
			
			$scope.pcsCard2 = PcsCard2;
			
			$scope.pcsCard3 = PcsCard3;
			
			$scope.pcsTraits = PcsTraits;
			
			$scope.pcsFeats = PcsFeats;
			
			$scope.pcsAugments = PcsAugments;
			
			$scope.pcsItems = PcsItems;
			
			$scope.Architect = Architect;
			
		//	$scope.Player = Player;
			
			$scope.CoreVars = CoreVars;
			
			var pcNew = false;
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if (!enable) return;
				$scope.$on('$destroy', onDestroy);
				$scope.$on('screenSize:onHeightChange', onHeightChange);
				$scope.$on('ability:onPress', Player.chooseAbility);
        		$scope.$on('PcsCard1:updateAbility', Player.updateAbility);
				$scope.$watch('CoreVars.EXP', Player.watchEXP);
				$scope.$watch('Bakery.resource.experience', Player.watchExperience);
				$scope.$watch('Bakery.resource.level', Player.watchLevel);
			};
			
			var onDestroy = function(){
				toggleListeners(false);
			};
			
			var onHeightChange = function(event, object){
				$scope.windowHeight = object.newHeight;
				$scope.$digest();
			};
			
            //BROWSE Functions
            $scope.browsePcs = function(){
				PcsBread.browse();
			};
			
			$scope.browseDecks = function(param){
				DecksBread.browse(param);
			};
            
            //READ Functions
            $scope.readCard = function(card){
				CardsBread.read(card, CardsBread.setPanelData);
			};
            
            $scope.readDeck = function(deck){
				DecksBread.read(deck);
			};
            
			$scope.readPc = function(pc){
				PcsBread.read(pc);
				pcNew = false;
			};
			
            //ADD Functions
            $scope.addCard = function(deck, cardType, cardNumber, deckShift, deckSave){
				CardsBread.add(deck, cardType, cardNumber, deckShift, deckSave);
			};
            
            $scope.addDeck = function(type, size){
				DecksBread.add(type, size);
			};
            
            $scope.addPc = function(){
				PcsBread.add();
				pcNew = true;
			};
            
            //EDIT Functions
            $scope.editCard = function(card){
				CardsBread.edit(card);
			};
            
            $scope.editDeck = function(deck){
				DecksBread.edit(deck);
			};
            
             $scope.editPc = function(pc){
				PcsBread.edit(pc);
				pcNew = false;
			};
            
            //DELETE Functions
            $scope.deleteCard = function(panel){
				CardsBread.delete(panel, Bakery.resource);
			};
            
			$scope.deleteDeck = function(deck){
				DecksBread.delete(deck, Bakery.resource);
			};
            
            $scope.deletePc = function(pc){
				PcsBread.delete(pc, Bakery.resource);
			};
			
            //Misc Handler Functions
			$scope.exitPc = function(pc){
				if(pcNew){
					PcsBread.delete(pc, Bakery.resource);
				}
				$scope.browsePcs();
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
			
			initialize();
			
		}
	]);