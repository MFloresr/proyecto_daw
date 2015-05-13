'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Movile = mongoose.model('Movile'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, movile;

/**
 * Movile routes tests
 */
describe('Movile CRUD tests', function() {
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

		// Save a user to the test db and create new Movile
		user.save(function() {
			movile = {
				name: 'Movile Name'
			};

			done();
		});
	});

	it('should be able to save Movile instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Movile
				agent.post('/moviles')
					.send(movile)
					.expect(200)
					.end(function(movileSaveErr, movileSaveRes) {
						// Handle Movile save error
						if (movileSaveErr) done(movileSaveErr);

						// Get a list of Moviles
						agent.get('/moviles')
							.end(function(movilesGetErr, movilesGetRes) {
								// Handle Movile save error
								if (movilesGetErr) done(movilesGetErr);

								// Get Moviles list
								var moviles = movilesGetRes.body;

								// Set assertions
								(moviles[0].user._id).should.equal(userId);
								(moviles[0].name).should.match('Movile Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Movile instance if not logged in', function(done) {
		agent.post('/moviles')
			.send(movile)
			.expect(401)
			.end(function(movileSaveErr, movileSaveRes) {
				// Call the assertion callback
				done(movileSaveErr);
			});
	});

	it('should not be able to save Movile instance if no name is provided', function(done) {
		// Invalidate name field
		movile.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Movile
				agent.post('/moviles')
					.send(movile)
					.expect(400)
					.end(function(movileSaveErr, movileSaveRes) {
						// Set message assertion
						(movileSaveRes.body.message).should.match('Please fill Movile name');
						
						// Handle Movile save error
						done(movileSaveErr);
					});
			});
	});

	it('should be able to update Movile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Movile
				agent.post('/moviles')
					.send(movile)
					.expect(200)
					.end(function(movileSaveErr, movileSaveRes) {
						// Handle Movile save error
						if (movileSaveErr) done(movileSaveErr);

						// Update Movile name
						movile.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Movile
						agent.put('/moviles/' + movileSaveRes.body._id)
							.send(movile)
							.expect(200)
							.end(function(movileUpdateErr, movileUpdateRes) {
								// Handle Movile update error
								if (movileUpdateErr) done(movileUpdateErr);

								// Set assertions
								(movileUpdateRes.body._id).should.equal(movileSaveRes.body._id);
								(movileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Moviles if not signed in', function(done) {
		// Create new Movile model instance
		var movileObj = new Movile(movile);

		// Save the Movile
		movileObj.save(function() {
			// Request Moviles
			request(app).get('/moviles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Movile if not signed in', function(done) {
		// Create new Movile model instance
		var movileObj = new Movile(movile);

		// Save the Movile
		movileObj.save(function() {
			request(app).get('/moviles/' + movileObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', movile.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Movile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Movile
				agent.post('/moviles')
					.send(movile)
					.expect(200)
					.end(function(movileSaveErr, movileSaveRes) {
						// Handle Movile save error
						if (movileSaveErr) done(movileSaveErr);

						// Delete existing Movile
						agent.delete('/moviles/' + movileSaveRes.body._id)
							.send(movile)
							.expect(200)
							.end(function(movileDeleteErr, movileDeleteRes) {
								// Handle Movile error error
								if (movileDeleteErr) done(movileDeleteErr);

								// Set assertions
								(movileDeleteRes.body._id).should.equal(movileSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Movile instance if not signed in', function(done) {
		// Set Movile user 
		movile.user = user;

		// Create new Movile model instance
		var movileObj = new Movile(movile);

		// Save the Movile
		movileObj.save(function() {
			// Try deleting Movile
			request(app).delete('/moviles/' + movileObj._id)
			.expect(401)
			.end(function(movileDeleteErr, movileDeleteRes) {
				// Set message assertion
				(movileDeleteRes.body.message).should.match('User is not logged in');

				// Handle Movile error error
				done(movileDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Movile.remove().exec();
		done();
	});
});