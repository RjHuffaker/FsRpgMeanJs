'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Aspect = mongoose.model('Aspect'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, aspect;

/**
 * Aspect routes tests
 */
describe('Aspect BREAD tests', function() {
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

		// Save a user to the test db and create new Aspect
		user.save(function() {
			aspect = {
				name: 'Aspect Name'
			};

			done();
		});
	});

	it('should be able to save Aspect instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Aspect
				agent.post('/aspect')
					.send(aspect)
					.expect(200)
					.end(function(aspectSaveErr, aspectSaveRes) {
						// Handle Aspect save error
						if (aspectSaveErr) done(aspectSaveErr);

						// Get a list of Aspects
						agent.get('/aspects')
							.end(function(aspectsGetErr, aspectsGetRes) {
								// Handle Aspect save error
								if (aspectsGetErr) done(aspectsGetErr);

								// Get Aspects list
								var aspects = aspectsGetRes.body;

								// Set assertions
								(aspects[0].user._id).should.equal(userId);
								(aspects[0].name).should.match('Aspect Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Aspect instance if not logged in', function(done) {
		agent.post('/aspect')
			.send(aspect)
			.expect(401)
			.end(function(aspectSaveErr, aspectSaveRes) {
				// Call the assertion callback
				done(aspectSaveErr);
			});
	});

	it('should be able to update Aspect instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Aspect
				agent.post('/aspect')
					.send(aspect)
					.expect(200)
					.end(function(aspectSaveErr, aspectSaveRes) {
						// Handle Aspect save error
						if (aspectSaveErr) done(aspectSaveErr);

						// Update Aspect name
						aspect.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Aspect
						agent.put('/aspect/' + aspectSaveRes.body._id)
							.send(aspect)
							.expect(200)
							.end(function(aspectUpdateErr, aspectUpdateRes) {
								// Handle Aspect update error
								if (aspectUpdateErr) done(aspectUpdateErr);

								// Set assertions
								(aspectUpdateRes.body._id).should.equal(aspectSaveRes.body._id);
								(aspectUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Aspects if not signed in', function(done) {
		// Create new Aspect model instance
		var aspectObj = new Aspect(aspect);

		// Save the Aspect
		aspectObj.save(function() {
			// Request Aspects
			request(app).get('/aspects')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Aspect if not signed in', function(done) {
		// Create new Aspect model instance
		var aspectObj = new Aspect(aspect);

		// Save the Aspect
		aspectObj.save(function() {
			request(app).get('/aspect/' + aspectObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', aspect.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Aspect instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Aspect
				agent.post('/aspect')
					.send(aspect)
					.expect(200)
					.end(function(aspectSaveErr, aspectSaveRes) {
						// Handle Aspect save error
						if (aspectSaveErr) done(aspectSaveErr);

						// Delete existing Aspect
						agent.delete('/aspect/' + aspectSaveRes.body._id)
							.send(aspect)
							.expect(200)
							.end(function(aspectDeleteErr, aspectDeleteRes) {
								// Handle Aspect error error
								if (aspectDeleteErr) done(aspectDeleteErr);

								// Set assertions
								(aspectDeleteRes.body._id).should.equal(aspectSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Aspect instance if not signed in', function(done) {
		// Set Aspect user 
		aspect.user = user;

		// Create new Aspect model instance
		var aspectObj = new Aspect(aspect);

		// Save the Aspect
		aspectObj.save(function() {
			// Try deleting Aspect
			request(app).delete('/aspect/' + aspectObj._id)
			.expect(401)
			.end(function(aspectDeleteErr, aspectDeleteRes) {
				// Set message assertion
				(aspectDeleteRes.body.message).should.match('User is not logged in');

				// Handle Aspect error error
				done(aspectDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Aspect.remove().exec();
		done();
	});
});