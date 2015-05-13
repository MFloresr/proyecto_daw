'use strict';

(function() {
	// Torres Controller Spec
	describe('Torres Controller Tests', function() {
		// Initialize global variables
		var TorresController,
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

			// Initialize the Torres controller.
			TorresController = $controller('TorresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Torre object fetched from XHR', inject(function(Torres) {
			// Create sample Torre using the Torres service
			var sampleTorre = new Torres({
				name: 'New Torre'
			});

			// Create a sample Torres array that includes the new Torre
			var sampleTorres = [sampleTorre];

			// Set GET response
			$httpBackend.expectGET('torres').respond(sampleTorres);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.torres).toEqualData(sampleTorres);
		}));

		it('$scope.findOne() should create an array with one Torre object fetched from XHR using a torreId URL parameter', inject(function(Torres) {
			// Define a sample Torre object
			var sampleTorre = new Torres({
				name: 'New Torre'
			});

			// Set the URL parameter
			$stateParams.torreId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/torres\/([0-9a-fA-F]{24})$/).respond(sampleTorre);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.torre).toEqualData(sampleTorre);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Torres) {
			// Create a sample Torre object
			var sampleTorrePostData = new Torres({
				name: 'New Torre'
			});

			// Create a sample Torre response
			var sampleTorreResponse = new Torres({
				_id: '525cf20451979dea2c000001',
				name: 'New Torre'
			});

			// Fixture mock form input values
			scope.name = 'New Torre';

			// Set POST response
			$httpBackend.expectPOST('torres', sampleTorrePostData).respond(sampleTorreResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Torre was created
			expect($location.path()).toBe('/torres/' + sampleTorreResponse._id);
		}));

		it('$scope.update() should update a valid Torre', inject(function(Torres) {
			// Define a sample Torre put data
			var sampleTorrePutData = new Torres({
				_id: '525cf20451979dea2c000001',
				name: 'New Torre'
			});

			// Mock Torre in scope
			scope.torre = sampleTorrePutData;

			// Set PUT response
			$httpBackend.expectPUT(/torres\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/torres/' + sampleTorrePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid torreId and remove the Torre from the scope', inject(function(Torres) {
			// Create new Torre object
			var sampleTorre = new Torres({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Torres array and include the Torre
			scope.torres = [sampleTorre];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/torres\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTorre);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.torres.length).toBe(0);
		}));
	});
}());