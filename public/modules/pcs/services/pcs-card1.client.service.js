'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for managing pc1 data.
pcsModule.factory('PcsCard1', ['$rootScope', 'Pcs',
	function($rootScope, Pcs){
		var service = {};
		
		service.chosenDie = {};
		service.previousDie = {};
		service.chosenAbility = {};
		
		service.diceBoxShown = false;
		
		service.hideDiceBox = function(){
			this.diceBoxShown = !this.diceBoxShown;
		};
		
		service.chooseAbility = function(ability){
			this.diceBoxShown = true;
			this.chosenAbility = Pcs.pc.cards[0].abilities[ability];
		};
		
		service.chooseDie = function(dice){
			this.chosenDie = Pcs.pc.cards[0].dicepool[dice];
			
			this.previousDie = this.chosenAbility.dice;
			
			Pcs.pc.cards[0].dicepool[dice] = Pcs.pc.cards[0].dicepool[0];
			
			if(this.previousDie.order > 0){
				Pcs.pc.cards[0].dicepool[this.previousDie.order] = this.previousDie;
			}
			
			Pcs.pc.cards[0].abilities[this.chosenAbility.order].dice = this.chosenDie;
			
			this.hideDiceBox();
			switch(this.chosenAbility.order){
				case 0:
				case 1:
					$rootScope.$broadcast('pcsCard1:updateStrPhy', {
						_str: Pcs.pc.cards[0].abilities[0],
						_phy: Pcs.pc.cards[0].abilities[1]
					});
					break;
				case 2:
				case 3:
					$rootScope.$broadcast('pcsCard1:updateFleDex', {
						_fle: Pcs.pc.cards[0].abilities[2],
						_dex: Pcs.pc.cards[0].abilities[3]
					});
					break;
				case 4:
				case 5:
					$rootScope.$broadcast('pcsCard1:updateAcuInt', {
						_acu: Pcs.pc.cards[0].abilities[4],
						_int: Pcs.pc.cards[0].abilities[5]
					});
					break;
				case 6:
				case 7:
					$rootScope.$broadcast('pcsCard1:updateWisCha', {
						_wis: Pcs.pc.cards[0].abilities[6],
						_cha: Pcs.pc.cards[0].abilities[7]
					});
					break;
			}
		};
		
		service.factorBlock = function(_str, _phy){
			if (Number(_str.dice.sides) > Number(_phy.dice.sides)){
				Pcs.pc.cards[0].block = '2' + _str.dice.name;
			} else {
				Pcs.pc.cards[0].block = '2' + _phy.dice.name;
			}
		};
		
		service.factorDodge = function(_fle, _dex){
			if (Number(_fle.dice.sides) > Number(_dex.dice.sides)){
				Pcs.pc.cards[0].dodge = '2' + _fle.dice.name;
			} else {
				Pcs.pc.cards[0].dodge = '2' + _dex.dice.name;
			}
		};
		
		service.factorAlertness = function(_acu, _int){
			if (Number(_acu.dice.sides) > Number(_int.dice.sides)){
				Pcs.pc.cards[0].alertness = '2' + _acu.dice.name;
			} else {
				Pcs.pc.cards[0].alertness = '2' + _int.dice.name;
			}
		};
		
		service.factorTenacity = function(_wis, _cha){
			if (Number(_wis.dice.sides) > Number(_cha.dice.sides)){
				Pcs.pc.cards[0].tenacity = '2' + _wis.dice.name;
			} else {
				Pcs.pc.cards[0].tenacity = '2' + _cha.dice.name;
			}
		};
		
		
		
		return service;
	}]);