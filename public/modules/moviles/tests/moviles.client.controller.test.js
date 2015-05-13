'use strict';

(function() {
	// Moviles Controller Spec
	describe('Moviles Controller Tests', function() {
		// Initialize global variables
		var MovilesController,
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

			// Initialize the Moviles controller.
			MovilesController = $controller('MovilesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Movile object fetched from XHR', inject(function(Moviles) {
			// Create sample Movile using the Moviles service
			var sampleMovile = new Moviles({
				name: 'New Movile'
			});

			// Create a sample Moviles array that includes the new Movile
			var sampleMoviles = [sampleMovile];

			// Set GET response
			$httpBackend.expectGET('moviles').respond(sampleMoviles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.moviles).toEqualData(sampleMoviles);
		}));

		it('$scope.findOne() should create an array with one Movile object fetched from XHR using a movileId URL parameter', inject(function(Moviles) {
			// Define a sample Movile object
			var sampleMovile = new Moviles({
				name: 'New Movile'
			});

			// Set the URL parameter
			$stateParams.movileId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/moviles\/([0-9a-fA-F]{24})$/).respond(sampleMovile);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.movile).toEqualData(sampleMovile);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Moviles) {
			// Create a sample Movile object
			var sampleMovilePostData = new Moviles({
				name: 'New Movile'
			});

			// Create a sample Movile response
			var sampleMovileResponse = new Moviles({
				_id: '525cf20451979dea2c000001',
				name: 'New Movile'
			});

			// Fixture mock form input values
			scope.name = 'New Movile';

			// Set POST response
			$httpBackend.expectPOST('moviles', sampleMovilePostData).respond(sampleMovileResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Movile was created
			expect($location.path()).toBe('/moviles/' + sampleMovileResponse._id);
		}));

		it('$scope.update() should update a valid Movile', inject(function(Moviles) {
			// Define a sample Movile put data
			var sampleMovilePutData = new Moviles({
				_id: '525cf20451979dea2c000001',
				name: 'New Movile'
			});

			// Mock Movile in scope
			scope.movile = sampleMovilePutData;

			// Set PUT response
			$httpBackend.expectPUT(/moviles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/moviles/' + sampleMovilePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid movileId and remove the Movile from the scope', inject(function(Moviles) {
			// Create new Movile object
			var sampleMovile = new Moviles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Moviles array and include the Movile
			scope.moviles = [sampleMovile];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/moviles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMovile);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.moviles.length).toBe(0);
		}));
	});
}());