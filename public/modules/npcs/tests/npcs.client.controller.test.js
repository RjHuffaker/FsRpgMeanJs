'use strict';

(function() {
	// Npcs Controller Spec
	describe('Npcs Controller Tests', function() {
		// Initialize global variables
		var NpcsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Npcs controller.
			NpcsController = $controller('NpcsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Npc object fetched from XHR', inject(function(Npcs) {
			// Create sample Npc using the Npcs service
			var sampleNpc = new Npcs({
				name: 'New Npc'
			});

			// Create a sample Npcs array that includes the new Npc
			var sampleNpcs = [sampleNpc];

			// Set GET response
			$httpBackend.expectGET('npcs').respond(sampleNpcs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.npcs).toEqualData(sampleNpcs);
		}));

		it('$scope.findOne() should create an array with one Npc object fetched from XHR using a npcId URL parameter', inject(function(Npcs) {
			// Define a sample Npc object
			var sampleNpc = new Npcs({
				name: 'New Npc'
			});

			// Set the URL parameter
			$stateParams.npcId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/npcs\/([0-9a-fA-F]{24})$/).respond(sampleNpc);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.npc).toEqualData(sampleNpc);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Npcs) {
			// Create a sample Npc object
			var sampleNpcPostData = new Npcs({
				name: 'New Npc'
			});

			// Create a sample Npc response
			var sampleNpcResponse = new Npcs({
				_id: '525cf20451979dea2c000001',
				name: 'New Npc'
			});

			// Fixture mock form input values
			scope.name = 'New Npc';

			// Set POST response
			$httpBackend.expectPOST('npcs', sampleNpcPostData).respond(sampleNpcResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Npc was created
			expect($location.path()).toBe('/npcs/' + sampleNpcResponse._id);
		}));

		it('$scope.update() should update a valid Npc', inject(function(Npcs) {
			// Define a sample Npc put data
			var sampleNpcPutData = new Npcs({
				_id: '525cf20451979dea2c000001',
				name: 'New Npc'
			});

			// Mock Npc in scope
			scope.npc = sampleNpcPutData;

			// Set PUT response
			$httpBackend.expectPUT(/npcs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/npcs/' + sampleNpcPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid npcId and remove the Npc from the scope', inject(function(Npcs) {
			// Create new Npc object
			var sampleNpc = new Npcs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Npcs array and include the Npc
			scope.npcs = [sampleNpc];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/npcs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNpc);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.npcs.length).toBe(0);
		}));
	});
}());