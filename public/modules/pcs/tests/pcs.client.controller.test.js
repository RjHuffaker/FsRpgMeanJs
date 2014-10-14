'use strict';

(function() {
	// Pcs Controller Spec
	describe('Pcs Controller Tests', function() {
		// Initialize global variables
		var PcsController,
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

			// Initialize the Pcs controller.
			PcsController = $controller('PcsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pc object fetched from XHR', inject(function(Pcs) {
			// Create sample Pc using the Pcs service
			var samplePc = new Pcs({
				name: 'New Pc'
			});

			// Create a sample Pcs array that includes the new Pc
			var samplePcs = [samplePc];

			// Set GET response
			$httpBackend.expectGET('pcs').respond(samplePcs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pcs).toEqualData(samplePcs);
		}));

		it('$scope.findOne() should create an array with one Pc object fetched from XHR using a pcId URL parameter', inject(function(Pcs) {
			// Define a sample Pc object
			var samplePc = new Pcs({
				name: 'New Pc'
			});

			// Set the URL parameter
			$stateParams.pcId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pcs\/([0-9a-fA-F]{24})$/).respond(samplePc);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pc).toEqualData(samplePc);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pcs) {
			// Create a sample Pc object
			var samplePcPostData = new Pcs({
				name: 'New Pc'
			});

			// Create a sample Pc response
			var samplePcResponse = new Pcs({
				_id: '525cf20451979dea2c000001',
				name: 'New Pc'
			});

			// Fixture mock form input values
			scope.name = 'New Pc';

			// Set POST response
			$httpBackend.expectPOST('pcs', samplePcPostData).respond(samplePcResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pc was created
			expect($location.path()).toBe('/pcs/' + samplePcResponse._id);
		}));

		it('$scope.update() should update a valid Pc', inject(function(Pcs) {
			// Define a sample Pc put data
			var samplePcPutData = new Pcs({
				_id: '525cf20451979dea2c000001',
				name: 'New Pc'
			});

			// Mock Pc in scope
			scope.pc = samplePcPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pcs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pcs/' + samplePcPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pcId and remove the Pc from the scope', inject(function(Pcs) {
			// Create new Pc object
			var samplePc = new Pcs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pcs array and include the Pc
			scope.pcs = [samplePc];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pcs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePc);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pcs.length).toBe(0);
		}));
	});
}());