'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Torre = mongoose.model('Torre'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, torre;

/**
 * Torre routes tests
 */
describe('Torre CRUD tests', function() {
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

		// Save a user to the test db and create new Torre
		user.save(function() {
			torre = {
				name: 'Torre Name'
			};

			done();
		});
	});

	it('should be able to save Torre instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Torre
				agent.post('/torres')
					.send(torre)
					.expect(200)
					.end(function(torreSaveErr, torreSaveRes) {
						// Handle Torre save error
						if (torreSaveErr) done(torreSaveErr);

						// Get a list of Torres
						agent.get('/torres')
							.end(function(torresGetErr, torresGetRes) {
								// Handle Torre save error
								if (torresGetErr) done(torresGetErr);

								// Get Torres list
								var torres = torresGetRes.body;

								// Set assertions
								(torres[0].user._id).should.equal(userId);
								(torres[0].name).should.match('Torre Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Torre instance if not logged in', function(done) {
		agent.post('/torres')
			.send(torre)
			.expect(401)
			.end(function(torreSaveErr, torreSaveRes) {
				// Call the assertion callback
				done(torreSaveErr);
			});
	});

	it('should not be able to save Torre instance if no name is provided', function(done) {
		// Invalidate name field
		torre.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Torre
				agent.post('/torres')
					.send(torre)
					.expect(400)
					.end(function(torreSaveErr, torreSaveRes) {
						// Set message assertion
						(torreSaveRes.body.message).should.match('Please fill Torre name');
						
						// Handle Torre save error
						done(torreSaveErr);
					});
			});
	});

	it('should be able to update Torre instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Torre
				agent.post('/torres')
					.send(torre)
					.expect(200)
					.end(function(torreSaveErr, torreSaveRes) {
						// Handle Torre save error
						if (torreSaveErr) done(torreSaveErr);

						// Update Torre name
						torre.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Torre
						agent.put('/torres/' + torreSaveRes.body._id)
							.send(torre)
							.expect(200)
							.end(function(torreUpdateErr, torreUpdateRes) {
								// Handle Torre update error
								if (torreUpdateErr) done(torreUpdateErr);

								// Set assertions
								(torreUpdateRes.body._id).should.equal(torreSaveRes.body._id);
								(torreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Torres if not signed in', function(done) {
		// Create new Torre model instance
		var torreObj = new Torre(torre);

		// Save the Torre
		torreObj.save(function() {
			// Request Torres
			request(app).get('/torres')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Torre if not signed in', function(done) {
		// Create new Torre model instance
		var torreObj = new Torre(torre);

		// Save the Torre
		torreObj.save(function() {
			request(app).get('/torres/' + torreObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', torre.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Torre instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Torre
				agent.post('/torres')
					.send(torre)
					.expect(200)
					.end(function(torreSaveErr, torreSaveRes) {
						// Handle Torre save error
						if (torreSaveErr) done(torreSaveErr);

						// Delete existing Torre
						agent.delete('/torres/' + torreSaveRes.body._id)
							.send(torre)
							.expect(200)
							.end(function(torreDeleteErr, torreDeleteRes) {
								// Handle Torre error error
								if (torreDeleteErr) done(torreDeleteErr);

								// Set assertions
								(torreDeleteRes.body._id).should.equal(torreSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Torre instance if not signed in', function(done) {
		// Set Torre user 
		torre.user = user;

		// Create new Torre model instance
		var torreObj = new Torre(torre);

		// Save the Torre
		torreObj.save(function() {
			// Try deleting Torre
			request(app).delete('/torres/' + torreObj._id)
			.expect(401)
			.end(function(torreDeleteErr, torreDeleteRes) {
				// Set message assertion
				(torreDeleteRes.body.message).should.match('User is not logged in');

				// Handle Torre error error
				done(torreDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Torre.remove().exec();
		done();
	});
});