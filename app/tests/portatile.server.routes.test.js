'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Portatile = mongoose.model('Portatile'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portatile;

/**
 * Portatile routes tests
 */
describe('Portatile CRUD tests', function() {
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

		// Save a user to the test db and create new Portatile
		user.save(function() {
			portatile = {
				name: 'Portatile Name'
			};

			done();
		});
	});

	it('should be able to save Portatile instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portatile
				agent.post('/portatiles')
					.send(portatile)
					.expect(200)
					.end(function(portatileSaveErr, portatileSaveRes) {
						// Handle Portatile save error
						if (portatileSaveErr) done(portatileSaveErr);

						// Get a list of Portatiles
						agent.get('/portatiles')
							.end(function(portatilesGetErr, portatilesGetRes) {
								// Handle Portatile save error
								if (portatilesGetErr) done(portatilesGetErr);

								// Get Portatiles list
								var portatiles = portatilesGetRes.body;

								// Set assertions
								(portatiles[0].user._id).should.equal(userId);
								(portatiles[0].name).should.match('Portatile Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portatile instance if not logged in', function(done) {
		agent.post('/portatiles')
			.send(portatile)
			.expect(401)
			.end(function(portatileSaveErr, portatileSaveRes) {
				// Call the assertion callback
				done(portatileSaveErr);
			});
	});

	it('should not be able to save Portatile instance if no name is provided', function(done) {
		// Invalidate name field
		portatile.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portatile
				agent.post('/portatiles')
					.send(portatile)
					.expect(400)
					.end(function(portatileSaveErr, portatileSaveRes) {
						// Set message assertion
						(portatileSaveRes.body.message).should.match('Please fill Portatile name');
						
						// Handle Portatile save error
						done(portatileSaveErr);
					});
			});
	});

	it('should be able to update Portatile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portatile
				agent.post('/portatiles')
					.send(portatile)
					.expect(200)
					.end(function(portatileSaveErr, portatileSaveRes) {
						// Handle Portatile save error
						if (portatileSaveErr) done(portatileSaveErr);

						// Update Portatile name
						portatile.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portatile
						agent.put('/portatiles/' + portatileSaveRes.body._id)
							.send(portatile)
							.expect(200)
							.end(function(portatileUpdateErr, portatileUpdateRes) {
								// Handle Portatile update error
								if (portatileUpdateErr) done(portatileUpdateErr);

								// Set assertions
								(portatileUpdateRes.body._id).should.equal(portatileSaveRes.body._id);
								(portatileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portatiles if not signed in', function(done) {
		// Create new Portatile model instance
		var portatileObj = new Portatile(portatile);

		// Save the Portatile
		portatileObj.save(function() {
			// Request Portatiles
			request(app).get('/portatiles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portatile if not signed in', function(done) {
		// Create new Portatile model instance
		var portatileObj = new Portatile(portatile);

		// Save the Portatile
		portatileObj.save(function() {
			request(app).get('/portatiles/' + portatileObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portatile.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portatile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portatile
				agent.post('/portatiles')
					.send(portatile)
					.expect(200)
					.end(function(portatileSaveErr, portatileSaveRes) {
						// Handle Portatile save error
						if (portatileSaveErr) done(portatileSaveErr);

						// Delete existing Portatile
						agent.delete('/portatiles/' + portatileSaveRes.body._id)
							.send(portatile)
							.expect(200)
							.end(function(portatileDeleteErr, portatileDeleteRes) {
								// Handle Portatile error error
								if (portatileDeleteErr) done(portatileDeleteErr);

								// Set assertions
								(portatileDeleteRes.body._id).should.equal(portatileSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portatile instance if not signed in', function(done) {
		// Set Portatile user 
		portatile.user = user;

		// Create new Portatile model instance
		var portatileObj = new Portatile(portatile);

		// Save the Portatile
		portatileObj.save(function() {
			// Try deleting Portatile
			request(app).delete('/portatiles/' + portatileObj._id)
			.expect(401)
			.end(function(portatileDeleteErr, portatileDeleteRes) {
				// Set message assertion
				(portatileDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portatile error error
				done(portatileDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Portatile.remove().exec();
		done();
	});
});