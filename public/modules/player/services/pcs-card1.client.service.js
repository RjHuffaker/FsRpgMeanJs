'use strict';

// Factory-service for managing pc1 data.
angular.module('player').factory('PcsCard1', ['$rootScope', 'Pcs',
	function($rootScope, Pcs){
		var service = {};
		
		service.chosenDie = {};
		service.previousDie = {};
		service.chosenAbility = {};
		
		service.chooseAbility = function(ability){
			service.chosenAbility = Pcs.pc.abilities[ability];
		};
		
		$rootScope.$on('ability:onPress', function(event, object){
			service.chosenAbility = Pcs.pc.abilities[object.ability.order];
			Pcs.modalShown = true;
			Pcs.diceBoxShown = true;
			console.log(object);
		});
		
		
		service.chooseDie = function(dice){
			Pcs.modalShown = false;
			
			var _abilityPair;
			var _ability1;
			var _ability2;
			
			this.chosenDie = Pcs.pc.dicepool[dice];
			
			this.previousDie = this.chosenAbility.dice;
			
			Pcs.pc.dicepool[dice] = Pcs.pc.dicepool[0];
			
			if(this.previousDie.order > 0){
				Pcs.pc.dicepool[this.previousDie.order] = this.previousDie;
			}
			
			Pcs.pc.abilities[this.chosenAbility.order].dice = this.chosenDie;
			
			switch(this.chosenAbility.order){
				case 0:
				case 1:
					_abilityPair = 1;
					_ability1 = Pcs.pc.abilities[0];
					_ability2 =  Pcs.pc.abilities[1];
					break;
				case 2:
				case 3:
					_abilityPair = 2;
					_ability1 = Pcs.pc.abilities[2];
					_ability2 =  Pcs.pc.abilities[3];
					break;
				case 4:
				case 5:
					_abilityPair = 3;
					_ability1 = Pcs.pc.abilities[4];
					_ability2 =  Pcs.pc.abilities[5];
					break;
				case 6:
				case 7:
					_abilityPair = 4;
					_ability1 = Pcs.pc.abilities[6];
					_ability2 =  Pcs.pc.abilities[7];
					break;
			}
			
			$rootScope.$broadcast('pcsCard1:updateAbility', {
				abilityPair: _abilityPair,
				ability1: _ability1,
				ability2: _ability2
			});
			
			Pcs.modalShown = false;
			Pcs.diceBoxShown = false;
		};
		
		service.factorBlock = function(_str, _phy){
			if (Number(_str.dice.sides) > Number(_phy.dice.sides)){
				Pcs.pc.block = '2' + _str.dice.name;
			} else {
				Pcs.pc.block = '2' + _phy.dice.name;
			}
		};
		
		service.factorDodge = function(_fle, _dex){
			if (Number(_fle.dice.sides) > Number(_dex.dice.sides)){
				Pcs.pc.dodge = '2' + _fle.dice.name;
			} else {
				Pcs.pc.dodge = '2' + _dex.dice.name;
			}
		};
		
		service.factorAlertness = function(_acu, _int){
			if (Number(_acu.dice.sides) > Number(_int.dice.sides)){
				Pcs.pc.alertness = '2' + _acu.dice.name;
			} else {
				Pcs.pc.alertness = '2' + _int.dice.name;
			}
		};
		
		service.factorTenacity = function(_wis, _cha){
			if (Number(_wis.dice.sides) > Number(_cha.dice.sides)){
				Pcs.pc.tenacity = '2' + _wis.dice.name;
			} else {
				Pcs.pc.tenacity = '2' + _cha.dice.name;
			}
		};
		
		return service;
	}]);