'use strict';

(function() {
	// Aspects Controller Spec
	describe('Aspects Controller Tests', function() {
		// Initialize global variables
		var AspectsController,
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

			// Initialize the Aspects controller.
			AspectsController = $controller('AspectsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Aspect object fetched from XHR', inject(function(Aspects) {
			// Create sample Aspect using the Aspects service
			var sampleAspect = new Aspects({
				name: 'New Aspect'
			});

			// Create a sample Aspects array that includes the new Aspect
			var sampleAspects = [sampleAspect];

			// Set GET response
			$httpBackend.expectGET('aspects').respond(sampleAspects);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.aspects).toEqualData(sampleAspects);
		}));

		it('$scope.findOne() should create an array with one Aspect object fetched from XHR using a aspectId URL parameter', inject(function(Aspects) {
			// Define a sample Aspect object
			var sampleAspect = new Aspects({
				name: 'New Aspect'
			});

			// Set the URL parameter
			$stateParams.aspectId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/aspects\/([0-9a-fA-F]{24})$/).respond(sampleAspect);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.aspect).toEqualData(sampleAspect);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Aspects) {
			// Create a sample Aspect object
			var sampleAspectPostData = new Aspects({
				name: 'New Aspect'
			});

			// Create a sample Aspect response
			var sampleAspectResponse = new Aspects({
				_id: '525cf20451979dea2c000001',
				name: 'New Aspect'
			});

			// Fixture mock form input values
			scope.name = 'New Aspect';

			// Set POST response
			$httpBackend.expectPOST('aspects', sampleAspectPostData).respond(sampleAspectResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Aspect was created
			expect($location.path()).toBe('/aspects/' + sampleAspectResponse._id);
		}));

		it('$scope.update() should update a valid Aspect', inject(function(Aspects) {
			// Define a sample Aspect put data
			var sampleAspectPutData = new Aspects({
				_id: '525cf20451979dea2c000001',
				name: 'New Aspect'
			});

			// Mock Aspect in scope
			scope.aspect = sampleAspectPutData;

			// Set PUT response
			$httpBackend.expectPUT(/aspects\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/aspects/' + sampleAspectPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid aspectId and remove the Aspect from the scope', inject(function(Aspects) {
			// Create new Aspect object
			var sampleAspect = new Aspects({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Aspects array and include the Aspect
			scope.aspects = [sampleAspect];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/aspects\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAspect);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.aspects.length).toBe(0);
		}));
	});
}());