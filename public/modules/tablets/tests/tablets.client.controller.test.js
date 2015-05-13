'use strict';

(function() {
	// Tablets Controller Spec
	describe('Tablets Controller Tests', function() {
		// Initialize global variables
		var TabletsController,
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

			// Initialize the Tablets controller.
			TabletsController = $controller('TabletsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tablet object fetched from XHR', inject(function(Tablets) {
			// Create sample Tablet using the Tablets service
			var sampleTablet = new Tablets({
				name: 'New Tablet'
			});

			// Create a sample Tablets array that includes the new Tablet
			var sampleTablets = [sampleTablet];

			// Set GET response
			$httpBackend.expectGET('tablets').respond(sampleTablets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tablets).toEqualData(sampleTablets);
		}));

		it('$scope.findOne() should create an array with one Tablet object fetched from XHR using a tabletId URL parameter', inject(function(Tablets) {
			// Define a sample Tablet object
			var sampleTablet = new Tablets({
				name: 'New Tablet'
			});

			// Set the URL parameter
			$stateParams.tabletId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tablets\/([0-9a-fA-F]{24})$/).respond(sampleTablet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tablet).toEqualData(sampleTablet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tablets) {
			// Create a sample Tablet object
			var sampleTabletPostData = new Tablets({
				name: 'New Tablet'
			});

			// Create a sample Tablet response
			var sampleTabletResponse = new Tablets({
				_id: '525cf20451979dea2c000001',
				name: 'New Tablet'
			});

			// Fixture mock form input values
			scope.name = 'New Tablet';

			// Set POST response
			$httpBackend.expectPOST('tablets', sampleTabletPostData).respond(sampleTabletResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tablet was created
			expect($location.path()).toBe('/tablets/' + sampleTabletResponse._id);
		}));

		it('$scope.update() should update a valid Tablet', inject(function(Tablets) {
			// Define a sample Tablet put data
			var sampleTabletPutData = new Tablets({
				_id: '525cf20451979dea2c000001',
				name: 'New Tablet'
			});

			// Mock Tablet in scope
			scope.tablet = sampleTabletPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tablets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tablets/' + sampleTabletPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tabletId and remove the Tablet from the scope', inject(function(Tablets) {
			// Create new Tablet object
			var sampleTablet = new Tablets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tablets array and include the Tablet
			scope.tablets = [sampleTablet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tablets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTablet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tablets.length).toBe(0);
		}));
	});
}());