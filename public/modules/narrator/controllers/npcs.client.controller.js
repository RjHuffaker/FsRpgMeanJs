'use strict';

// Npcs controller
angular.module('narrator').controller('NpcsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Npcs',
	function($scope, $stateParams, $location, Authentication, Npcs ) {
		$scope.authentication = Authentication;

		// Create new Npc
		$scope.create = function() {
			// Create new Npc object
			var npc = new Npcs ({
				name: this.name
			});

			// Redirect after save
			npc.$save(function(response) {
				$location.path('npcs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Npc
		$scope.remove = function( npc ) {
			if ( npc ) { npc.$remove();

				for (var i in $scope.npcs ) {
					if ($scope.npcs [i] === npc ) {
						$scope.npcs.splice(i, 1);
					}
				}
			} else {
				$scope.npc.$remove(function() {
					
				});
			}
		};

		// Update existing Npc
		$scope.update = function() {
			var npc = $scope.npc ;

			npc.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Npcs
		$scope.find = function() {
			$scope.npcs = Npcs.query(
				function(response) {
					console.log(response);
				}
			);
		};

		// Find existing Npc
		$scope.findOne = function() {
			$scope.npc = Npcs.get({ 
				npcId: $stateParams.npcId
			});
		};
	}
]);