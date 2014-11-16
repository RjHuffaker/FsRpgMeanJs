'use strict';

var pcsModule = angular.module('pcs');

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting PCs.
pcsModule.factory('PcsBreadSRVC', ['$stateParams', '$location', 'Authentication', 'Pcs',
	function($stateParams, $location, Authentication, Pcs){
		
		var service = {};
		
		var path;
		
		service.pc = {};

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
				cards: {
					pc1: {
						abilities: [
							{ name: 'Strength', order: 0},
							{ name: 'Physique', order: 1 },
							{ name: 'Flexibility', order: 2 },
							{ name: 'Dexterity', order: 3 },
							{ name: 'Acuity', order: 4 },
							{ name: 'Intelligence', order: 5 },
							{ name: 'Wisdom', order: 6 },
							{ name: 'Charisma', order: 7 }
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
						]
					}
				}
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