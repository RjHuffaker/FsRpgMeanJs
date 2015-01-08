'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting PCs.
pcsModule.factory('Pcs', ['$stateParams', '$location', 'Authentication', '$resource', 
	function($stateParams, $location, Authentication, $resource){
		
		var Pcs = $resource(
			'pcs/:pcId',
			{ pcId: '@_id' },
			{ update: { method: 'PUT' } }
		);
		
		var service = {};
		
		service.pc = {};
		
		service.cardByIndex = function(x_index, y_index){
			var card = {};
			for(var i = 0; i < this.pc.cards.length; i++){
				if(this.pc.cards[i].x_index === x_index && this.pc.cards[i].y_index === y_index){
					return i;
				}
			}
		};
		
		service.firstCard = function(){
			return this.cardByIndex(0, 0);
		};
		
		service.lastCard = function(){
			var _last = 0;
			var _card = {};
			for(var i = 0; i < this.pc.cards.length; i++){
				if(this.pc.cards[i].x_index > (_card.x_index || 0)){
					_last = i;
					_card = this.pc.cards[i];
				}
			}
			return _last;
		};
		
		service.deckWidth = function(){
			if(this.pc.cards){
				return this.pc.cards[this.lastCard()].x_coord + 10;
			} else {
				return 40;
			}
		};
		
		service.lowestCard = function(x_index) {
			var _lowest = 0;
			var _card = {};
			for(var i = 0; i < this.pc.cards.length; i++) {
				if(this.pc.cards[i].x_index === x_index){
					if(this.pc.cards[i].y_index > (_card.y_index || -1)){
						_lowest = i;
						_card = this.pc.cards[i];
					}
				}
			}
			return _lowest;
		};
		
		service.pcList = [];
		
		service.pcNew = false;
		
		service.pcSaved = false;
		
		// BROWSE Pcs
		service.browsePcs = function() {
			this.pcList = Pcs.query(
				function(response) {
					
				}
			);
		};
		
		// READ single Pc
		service.readPc = function() {
			this.pc = Pcs.get({
				pcId: $stateParams.pcId
			});
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
				cards: [
					{
						cardType: 'pc1',
						x_index: 0,
						y_index: 0,
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
						x_index: 1,
						y_index: 0,
						x_coord: 10,
						y_coord: 0,
						x_overlap: false,
						y_overlap: false,
						dragging: false,
						stacked: false,
						locked: true
					},
					{
						cardType: 'pc3',
						x_index: 2,
						y_index: 0,
						x_coord: 20,
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
						x_index: 3,
						y_index: 0,
						x_coord: 30,
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
			
			this.pc.$save(function(response) {
				$location.path('pcs/'+response._id+'/edit');
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
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
				this.pc.$remove(function() {
					$location.path('pcs');
				});
			}
			this.browsePcs();
		};
		
		return service;
	}]);