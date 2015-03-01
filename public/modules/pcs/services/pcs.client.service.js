'use strict';

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting PCs.
angular.module('pcs').factory('Pcs', ['$stateParams', '$location', 'Authentication', '$resource', 
	function($stateParams, $location, Authentication, $resource){
		
		var Pcs = $resource(
			'pcs/:pcId',
			{ pcId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var service = {};
		
		var optionsPanel = {
			optionsPanel: true
		};
		
		service.pc = {};
		
		service.modalShown = false;
		
		service.modalCardList = [];
		
		service.diceBoxShown = false;
		
		service.modalDeckShown = false;
		
		service.hideModal = function(){
			service.modalShown = false;
			service.diceBoxShown = false;
			service.modalDeckShown = false;
		};
		
		service.lastCard = function(){
			var _last = 0;
			var _card = {};
			for(var i = 0; i < this.pc.cardList.length; i++){
				if(this.pc.cardList[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = this.pc.cardList[i];
				}
			}
			return _last;
		};
		
		service.deckWidth = function(){
			if(this.pc.cardList){
				return this.pc.cardList[this.lastCard()].x_coord + 15;
			} else {
				return 30;
			}
		};
		
		service.pcList = [];
		
		service.pcNew = false;
		
		service.pcSaved = false;
		
		service.setPcList = function(){
			for(var i = 0; i < this.pcList.length; i++){
				this.pcList[i].cardRole = 'pcSummary';
				this.pcList[i].cardType = 'pcSummary';
				this.pcList[i].locked = true;
				this.pcList[i].x_coord = i * 15;
				this.pcList[i].y_coord = 0;
				this.pcList[i].dragging = false;
				this.pcList[i].stacked = false;
			}
		};
		
		// BROWSE Pcs
		service.browsePcs = function() {
			this.pcList = Pcs.query(
				function(response) {
					service.pcList.unshift(optionsPanel);
					service.setPcList();
				}
			);
			return {cardList: service.pcList};
		};
		
		// READ single Pc
		service.readPc = function(pcId) {
			service.pc = Pcs.get({
				pcId: pcId
			});
			console.log(service.pc);
			return service.pc;
		};
		
		// EDIT existing Pc
		service.editPc = function() {
			var pc = this.pc;
			
			pc.$update(function() {
				
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// ADD a new Pc
		service.addPc = function() {
			// Create new Pc object
			this.pc = new Pcs ({
				abilities: [
					{ name: 'Strength', order: 0, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Physique', order: 1, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Flexibility', order: 2, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Dexterity', order: 3, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Acuity', order: 4, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Intelligence', order: 5, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Wisdom', order: 6, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } },
					{ name: 'Charisma', order: 7, dice: { name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 } }
				],
				dicepool: [
					{ name: 'd__', image: 'modules/core/img/d___.png', sides: '0', order: 0 },
					{ name: 'd4', image: 'modules/core/img/d_04.png', sides: '4', order: 1 },
					{ name: 'd6', image: 'modules/core/img/d_06.png', sides: '6', order: 2 },
					{ name: 'd6', image: 'modules/core/img/d_06.png', sides: '6', order: 3 },
					{ name: 'd8', image: 'modules/core/img/d_08.png', sides: '8', order: 4 },
					{ name: 'd8', image: 'modules/core/img/d_08.png', sides: '8', order: 5 },
					{ name: 'd10', image: 'modules/core/img/d_10.png', sides: '10', order: 6 },
					{ name: 'd10', image: 'modules/core/img/d_10.png', sides: '10', order: 7 },
					{ name: 'd12', image: 'modules/core/img/d_12.png', sides: '12', order: 8 }
				],
				cardList: [
					{
						cardType: 'pc1',
						cardRole: 'player',
						x_coord: 0,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true
					},
					{
						cardType: 'pc2',
						cardRole: 'player',
						x_coord: 15,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true
					},
					{
						cardType: 'pc3',
						cardRole: 'player',
						x_coord: 30,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true,
					},
					{
						name: 'Level 0 Trait',
						cardType: 'trait',
						cardRole: 'player',
						x_coord: 45,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true,
						level: 0
					}
				]
			});
			
			this.pc.$save();
			return service.pc;
		};
		
		// DELETE existing Pc
		service.deletePc = function(pc) {
			if ( pc ) { pc.$remove();
				for (var i in this.pcs ) {
					if (this.pcs [i] === pc ) {
						this.pcs.splice(i, 1);
					}
				}
			} else {
				this.pc.$remove();
			}
			this.browsePcs();
		};
		
		return service;
	}]);