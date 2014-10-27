'use strict';

var pcsModule = angular.module('pcs');

// Pcs Controller
pcsModule.controller('PcsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pcs', '$log',
	function($scope, $stateParams, $location, Authentication, Pcs, $log) {
		this.authentication = Authentication;

		// Create new Pc
		this.create = function() {
			// Create new Pc object
			var pc = new Pcs ({
				name: this.name,
				sex: this.sex,
				race: this.race
			});

			// Redirect after save
			pc.$save(function(response) {
				$location.path('pcs');

				// Clear form fields
				this.name = '';
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// Find a list of Pcs
		this.find = function() {
			this.pcList = Pcs.query();
		};

		// Find existing Pc
		this.findOne = function() {
			this.pc = Pcs.get({
				pcId: $stateParams.pcId
			});
		};
		
		// Update existing Pc
		this.update = function() {
			var pc = this.pc ;

			pc.$update(function() {
				$location.path('pcs');
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// Remove existing Pc
		this.remove = function( pc ) {
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
			this.find();
		};
		
}]);
