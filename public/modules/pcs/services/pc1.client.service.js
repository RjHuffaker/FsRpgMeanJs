'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for managing pc1 data.
pcsModule.factory('Pc1SRVC', ['PcsBreadSRVC',
	function(PcsBreadSRVC){
		var service = {};
		
		service.chosenDie = {};
		service.previousDie = {};
		service.chosenAbility = {};
		
		service.diceModalShown = false;
		
		service.hideDiceModal = function(){
			this.diceModalShown = !this.diceModalShown;
		};
		
		
		
		service.chooseAbility = function(ability){
			this.diceModalShown = true;
			this.chosenAbility = PcsBreadSRVC.pc.cards.pc1.abilities[ability];
		};
		
		service.chooseDie = function(dice){
			this.chosenDie = PcsBreadSRVC.pc.cards.pc1.dicepool[dice];
			
			this.previousDie = this.chosenAbility.dice;
			
			PcsBreadSRVC.pc.cards.pc1.dicepool[dice] = PcsBreadSRVC.pc.cards.pc1.dicepool[0];
			
			if(this.previousDie.order > 0){
				PcsBreadSRVC.pc.cards.pc1.dicepool[this.previousDie.order] = this.previousDie;
			}
			
			PcsBreadSRVC.pc.cards.pc1.abilities[this.chosenAbility.order].dice = this.chosenDie;
			
			this.hideDiceModal();
		};
		
		
		
		return service;
	}]);