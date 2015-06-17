'use strict';

// Core Controller
angular.module('core')
	.controller('CoreController', ['$location', '$scope', '$rootScope', '$window', 'Authentication', 'Bakery', 'CardsBread', 'DecksBread', 'PcsBread', 'DataSRVC', 'PcsTraits', 'PcsFeats', 'PcsAugments', 'PcsItems', 'BuilderHub', 'PlayerHub', 'CoreVars', 'DeckUtils',
		function($location, $scope, $rootScope, $window, Authentication, Bakery, CardsBread, DecksBread, PcsBread, DataSRVC, PcsTraits, PcsFeats, PcsAugments, PcsItems, BuilderHub, PlayerHub, CoreVars, DeckUtils) {
			
			// This provides Authentication context.
			$scope.authentication = Authentication;
			
			$scope.Bakery = Bakery;
            
			$scope.dataSRVC = DataSRVC;
			
			$scope.pcsTraits = PcsTraits;
			
			$scope.pcsFeats = PcsFeats;
			
			$scope.pcsAugments = PcsAugments;
			
			$scope.pcsItems = PcsItems;
			
			$scope.BuilderHub = BuilderHub;
			
			$scope.PlayerHub = PlayerHub;
			
			$scope.CoreVars = CoreVars;
			
			var pcNew = false;
			
			var initialize = function(){
				toggleListeners(true);
			};
			
			var toggleListeners = function(enable){
				if (!enable) return;
				$scope.$on('$destroy', onDestroy);
				$scope.$on('ability:onPress', PlayerHub.chooseAbility);
				$scope.$watch('CoreVars.EXP', PlayerHub.watchEXP);
				$scope.$watch('Bakery.resource.experience', PlayerHub.watchExperience);
				$scope.$watch('Bakery.resource.level', PlayerHub.watchLevel);
			};
			
			var onDestroy = function(){
				toggleListeners(false);
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
				CardsBread.delete(Bakery.resource, panel);
			};
            
			$scope.deleteDeck = function(deck){
				DecksBread.delete(Bakery.resource, deck);
			};
            
            $scope.deletePc = function(pc){
				PcsBread.delete(Bakery.resource, pc);
			};
			
            //Misc Handler Functions
			$scope.exitPc = function(pc){
				if(pcNew){
					PcsBread.delete(Bakery.resource, pc);
				}
				$scope.browsePcs();
			};
			
			$scope.shuffleDeck = function(cardList){
				DeckUtils.shuffleDeck(cardList);
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