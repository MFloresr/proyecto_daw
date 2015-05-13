'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Componente = mongoose.model('Componente'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, componente;

/**
 * Componente routes tests
 */
describe('Componente CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Componente
		user.save(function() {
			componente = {
				name: 'Componente Name'
			};

			done();
		});
	});

	it('should be able to save Componente instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Componente
				agent.post('/componentes')
					.send(componente)
					.expect(200)
					.end(function(componenteSaveErr, componenteSaveRes) {
						// Handle Componente save error
						if (componenteSaveErr) done(componenteSaveErr);

						// Get a list of Componentes
						agent.get('/componentes')
							.end(function(componentesGetErr, componentesGetRes) {
								// Handle Componente save error
								if (componentesGetErr) done(componentesGetErr);

								// Get Componentes list
								var componentes = componentesGetRes.body;

								// Set assertions
								(componentes[0].user._id).should.equal(userId);
								(componentes[0].name).should.match('Componente Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Componente instance if not logged in', function(done) {
		agent.post('/componentes')
			.send(componente)
			.expect(401)
			.end(function(componenteSaveErr, componenteSaveRes) {
				// Call the assertion callback
				done(componenteSaveErr);
			});
	});

	it('should not be able to save Componente instance if no name is provided', function(done) {
		// Invalidate name field
		componente.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Componente
				agent.post('/componentes')
					.send(componente)
					.expect(400)
					.end(function(componenteSaveErr, componenteSaveRes) {
						// Set message assertion
						(componenteSaveRes.body.message).should.match('Please fill Componente name');
						
						// Handle Componente save error
						done(componenteSaveErr);
					});
			});
	});

	it('should be able to update Componente instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Componente
				agent.post('/componentes')
					.send(componente)
					.expect(200)
					.end(function(componenteSaveErr, componenteSaveRes) {
						// Handle Componente save error
						if (componenteSaveErr) done(componenteSaveErr);

						// Update Componente name
						componente.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Componente
						agent.put('/componentes/' + componenteSaveRes.body._id)
							.send(componente)
							.expect(200)
							.end(function(componenteUpdateErr, componenteUpdateRes) {
								// Handle Componente update error
								if (componenteUpdateErr) done(componenteUpdateErr);

								// Set assertions
								(componenteUpdateRes.body._id).should.equal(componenteSaveRes.body._id);
								(componenteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Componentes if not signed in', function(done) {
		// Create new Componente model instance
		var componenteObj = new Componente(componente);

		// Save the Componente
		componenteObj.save(function() {
			// Request Componentes
			request(app).get('/componentes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Componente if not signed in', function(done) {
		// Create new Componente model instance
		var componenteObj = new Componente(componente);

		// Save the Componente
		componenteObj.save(function() {
			request(app).get('/componentes/' + componenteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', componente.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Componente instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Componente
				agent.post('/componentes')
					.send(componente)
					.expect(200)
					.end(function(componenteSaveErr, componenteSaveRes) {
						// Handle Componente save error
						if (componenteSaveErr) done(componenteSaveErr);

						// Delete existing Componente
						agent.delete('/componentes/' + componenteSaveRes.body._id)
							.send(componente)
							.expect(200)
							.end(function(componenteDeleteErr, componenteDeleteRes) {
								// Handle Componente error error
								if (componenteDeleteErr) done(componenteDeleteErr);

								// Set assertions
								(componenteDeleteRes.body._id).should.equal(componenteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Componente instance if not signed in', function(done) {
		// Set Componente user 
		componente.user = user;

		// Create new Componente model instance
		var componenteObj = new Componente(componente);

		// Save the Componente
		componenteObj.save(function() {
			// Try deleting Componente
			request(app).delete('/componentes/' + componenteObj._id)
			.expect(401)
			.end(function(componenteDeleteErr, componenteDeleteRes) {
				// Set message assertion
				(componenteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Componente error error
				done(componenteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Componente.remove().exec();
		done();
	});
});