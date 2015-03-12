'use strict';

// Factory-service for managing pc1 data.
angular.module('pcs').factory('PcsCard1', ['$rootScope', 'BREAD',
	function($rootScope, BREAD){
		var service = {};
		
		service.chosenDie = {};
		service.previousDie = {};
		service.chosenAbility = {};
		
		service.chooseAbility = function(ability){
			service.chosenAbility = BREAD.resource.abilities[ability];
		};
		
		$rootScope.$on('ability:onPress', function(event, object){
			service.chosenAbility = BREAD.resource.abilities[object.ability.order];
		});
		
		
		service.chooseDie = function(dice){
			service.modalShown = false;
			
			var _abilityPair;
			var _ability1;
			var _ability2;
			
			this.chosenDie = BREAD.resource.dicepool[dice];
			
			this.previousDie = this.chosenAbility.dice;
			
			BREAD.resource.dicepool[dice] = BREAD.resource.dicepool[0];
			
			if(this.previousDie.order > 0){
				BREAD.resource.dicepool[this.previousDie.order] = this.previousDie;
			}
			
			BREAD.resource.abilities[this.chosenAbility.order].dice = this.chosenDie;
			
			switch(this.chosenAbility.order){
				case 0:
				case 1:
					_abilityPair = 1;
					_ability1 = BREAD.resource.abilities[0];
					_ability2 =  BREAD.resource.abilities[1];
					break;
				case 2:
				case 3:
					_abilityPair = 2;
					_ability1 = BREAD.resource.abilities[2];
					_ability2 =  BREAD.resource.abilities[3];
					break;
				case 4:
				case 5:
					_abilityPair = 3;
					_ability1 = BREAD.resource.abilities[4];
					_ability2 =  BREAD.resource.abilities[5];
					break;
				case 6:
				case 7:
					_abilityPair = 4;
					_ability1 = BREAD.resource.abilities[6];
					_ability2 =  BREAD.resource.abilities[7];
					break;
			}
			
			$rootScope.$broadcast('pcsCard1:updateAbility', {
				abilityPair: _abilityPair,
				ability1: _ability1,
				ability2: _ability2
			});
		};
		
		service.factorBlock = function(_str, _phy){
			if (Number(_str.dice.sides) > Number(_phy.dice.sides)){
				BREAD.resource.block = '2' + _str.dice.name;
			} else {
				BREAD.resource.block = '2' + _phy.dice.name;
			}
		};
		
		service.factorDodge = function(_fle, _dex){
			if (Number(_fle.dice.sides) > Number(_dex.dice.sides)){
				BREAD.resource.dodge = '2' + _fle.dice.name;
			} else {
				BREAD.resource.dodge = '2' + _dex.dice.name;
			}
		};
		
		service.factorAlertness = function(_acu, _int){
			if (Number(_acu.dice.sides) > Number(_int.dice.sides)){
				BREAD.resource.alertness = '2' + _acu.dice.name;
			} else {
				BREAD.resource.alertness = '2' + _int.dice.name;
			}
		};
		
		service.factorTenacity = function(_wis, _cha){
			if (Number(_wis.dice.sides) > Number(_cha.dice.sides)){
				BREAD.resource.tenacity = '2' + _wis.dice.name;
			} else {
				BREAD.resource.tenacity = '2' + _cha.dice.name;
			}
		};
		
		return service;
	}]);