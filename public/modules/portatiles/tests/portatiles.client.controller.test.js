'use strict';

(function() {
	// Portatiles Controller Spec
	describe('Portatiles Controller Tests', function() {
		// Initialize global variables
		var PortatilesController,
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

			// Initialize the Portatiles controller.
			PortatilesController = $controller('PortatilesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portatile object fetched from XHR', inject(function(Portatiles) {
			// Create sample Portatile using the Portatiles service
			var samplePortatile = new Portatiles({
				name: 'New Portatile'
			});

			// Create a sample Portatiles array that includes the new Portatile
			var samplePortatiles = [samplePortatile];

			// Set GET response
			$httpBackend.expectGET('portatiles').respond(samplePortatiles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portatiles).toEqualData(samplePortatiles);
		}));

		it('$scope.findOne() should create an array with one Portatile object fetched from XHR using a portatileId URL parameter', inject(function(Portatiles) {
			// Define a sample Portatile object
			var samplePortatile = new Portatiles({
				name: 'New Portatile'
			});

			// Set the URL parameter
			$stateParams.portatileId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portatiles\/([0-9a-fA-F]{24})$/).respond(samplePortatile);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portatile).toEqualData(samplePortatile);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Portatiles) {
			// Create a sample Portatile object
			var samplePortatilePostData = new Portatiles({
				name: 'New Portatile'
			});

			// Create a sample Portatile response
			var samplePortatileResponse = new Portatiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Portatile'
			});

			// Fixture mock form input values
			scope.name = 'New Portatile';

			// Set POST response
			$httpBackend.expectPOST('portatiles', samplePortatilePostData).respond(samplePortatileResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portatile was created
			expect($location.path()).toBe('/portatiles/' + samplePortatileResponse._id);
		}));

		it('$scope.update() should update a valid Portatile', inject(function(Portatiles) {
			// Define a sample Portatile put data
			var samplePortatilePutData = new Portatiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Portatile'
			});

			// Mock Portatile in scope
			scope.portatile = samplePortatilePutData;

			// Set PUT response
			$httpBackend.expectPUT(/portatiles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portatiles/' + samplePortatilePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portatileId and remove the Portatile from the scope', inject(function(Portatiles) {
			// Create new Portatile object
			var samplePortatile = new Portatiles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portatiles array and include the Portatile
			scope.portatiles = [samplePortatile];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portatiles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortatile);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portatiles.length).toBe(0);
		}));
	});
}());