'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tablet = mongoose.model('Tablet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tablet;

/**
 * Tablet routes tests
 */
describe('Tablet CRUD tests', function() {
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

		// Save a user to the test db and create new Tablet
		user.save(function() {
			tablet = {
				name: 'Tablet Name'
			};

			done();
		});
	});

	it('should be able to save Tablet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tablet
				agent.post('/tablets')
					.send(tablet)
					.expect(200)
					.end(function(tabletSaveErr, tabletSaveRes) {
						// Handle Tablet save error
						if (tabletSaveErr) done(tabletSaveErr);

						// Get a list of Tablets
						agent.get('/tablets')
							.end(function(tabletsGetErr, tabletsGetRes) {
								// Handle Tablet save error
								if (tabletsGetErr) done(tabletsGetErr);

								// Get Tablets list
								var tablets = tabletsGetRes.body;

								// Set assertions
								(tablets[0].user._id).should.equal(userId);
								(tablets[0].name).should.match('Tablet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tablet instance if not logged in', function(done) {
		agent.post('/tablets')
			.send(tablet)
			.expect(401)
			.end(function(tabletSaveErr, tabletSaveRes) {
				// Call the assertion callback
				done(tabletSaveErr);
			});
	});

	it('should not be able to save Tablet instance if no name is provided', function(done) {
		// Invalidate name field
		tablet.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tablet
				agent.post('/tablets')
					.send(tablet)
					.expect(400)
					.end(function(tabletSaveErr, tabletSaveRes) {
						// Set message assertion
						(tabletSaveRes.body.message).should.match('Please fill Tablet name');
						
						// Handle Tablet save error
						done(tabletSaveErr);
					});
			});
	});

	it('should be able to update Tablet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tablet
				agent.post('/tablets')
					.send(tablet)
					.expect(200)
					.end(function(tabletSaveErr, tabletSaveRes) {
						// Handle Tablet save error
						if (tabletSaveErr) done(tabletSaveErr);

						// Update Tablet name
						tablet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tablet
						agent.put('/tablets/' + tabletSaveRes.body._id)
							.send(tablet)
							.expect(200)
							.end(function(tabletUpdateErr, tabletUpdateRes) {
								// Handle Tablet update error
								if (tabletUpdateErr) done(tabletUpdateErr);

								// Set assertions
								(tabletUpdateRes.body._id).should.equal(tabletSaveRes.body._id);
								(tabletUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tablets if not signed in', function(done) {
		// Create new Tablet model instance
		var tabletObj = new Tablet(tablet);

		// Save the Tablet
		tabletObj.save(function() {
			// Request Tablets
			request(app).get('/tablets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tablet if not signed in', function(done) {
		// Create new Tablet model instance
		var tabletObj = new Tablet(tablet);

		// Save the Tablet
		tabletObj.save(function() {
			request(app).get('/tablets/' + tabletObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tablet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tablet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tablet
				agent.post('/tablets')
					.send(tablet)
					.expect(200)
					.end(function(tabletSaveErr, tabletSaveRes) {
						// Handle Tablet save error
						if (tabletSaveErr) done(tabletSaveErr);

						// Delete existing Tablet
						agent.delete('/tablets/' + tabletSaveRes.body._id)
							.send(tablet)
							.expect(200)
							.end(function(tabletDeleteErr, tabletDeleteRes) {
								// Handle Tablet error error
								if (tabletDeleteErr) done(tabletDeleteErr);

								// Set assertions
								(tabletDeleteRes.body._id).should.equal(tabletSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tablet instance if not signed in', function(done) {
		// Set Tablet user 
		tablet.user = user;

		// Create new Tablet model instance
		var tabletObj = new Tablet(tablet);

		// Save the Tablet
		tabletObj.save(function() {
			// Try deleting Tablet
			request(app).delete('/tablets/' + tabletObj._id)
			.expect(401)
			.end(function(tabletDeleteErr, tabletDeleteRes) {
				// Set message assertion
				(tabletDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tablet error error
				done(tabletDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tablet.remove().exec();
		done();
	});
});