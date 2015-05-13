'use strict';

(function() {
	// Componentes Controller Spec
	describe('Componentes Controller Tests', function() {
		// Initialize global variables
		var ComponentesController,
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

			// Initialize the Componentes controller.
			ComponentesController = $controller('ComponentesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Componente object fetched from XHR', inject(function(Componentes) {
			// Create sample Componente using the Componentes service
			var sampleComponente = new Componentes({
				name: 'New Componente'
			});

			// Create a sample Componentes array that includes the new Componente
			var sampleComponentes = [sampleComponente];

			// Set GET response
			$httpBackend.expectGET('componentes').respond(sampleComponentes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.componentes).toEqualData(sampleComponentes);
		}));

		it('$scope.findOne() should create an array with one Componente object fetched from XHR using a componenteId URL parameter', inject(function(Componentes) {
			// Define a sample Componente object
			var sampleComponente = new Componentes({
				name: 'New Componente'
			});

			// Set the URL parameter
			$stateParams.componenteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/componentes\/([0-9a-fA-F]{24})$/).respond(sampleComponente);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.componente).toEqualData(sampleComponente);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Componentes) {
			// Create a sample Componente object
			var sampleComponentePostData = new Componentes({
				name: 'New Componente'
			});

			// Create a sample Componente response
			var sampleComponenteResponse = new Componentes({
				_id: '525cf20451979dea2c000001',
				name: 'New Componente'
			});

			// Fixture mock form input values
			scope.name = 'New Componente';

			// Set POST response
			$httpBackend.expectPOST('componentes', sampleComponentePostData).respond(sampleComponenteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Componente was created
			expect($location.path()).toBe('/componentes/' + sampleComponenteResponse._id);
		}));

		it('$scope.update() should update a valid Componente', inject(function(Componentes) {
			// Define a sample Componente put data
			var sampleComponentePutData = new Componentes({
				_id: '525cf20451979dea2c000001',
				name: 'New Componente'
			});

			// Mock Componente in scope
			scope.componente = sampleComponentePutData;

			// Set PUT response
			$httpBackend.expectPUT(/componentes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/componentes/' + sampleComponentePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid componenteId and remove the Componente from the scope', inject(function(Componentes) {
			// Create new Componente object
			var sampleComponente = new Componentes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Componentes array and include the Componente
			scope.componentes = [sampleComponente];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/componentes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleComponente);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.componentes.length).toBe(0);
		}));
	});
}());