'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var torres = require('../../app/controllers/torres.server.controller');

	// Torres Routes
	app.route('/torres')
		.get(torres.list)
		.post(users.requiresLogin, torres.create);

	app.route('/torres/:torreId')
		.get(torres.read)
		.put(users.requiresLogin, torres.hasAuthorization, torres.update)
		.delete(users.requiresLogin, torres.hasAuthorization, torres.delete);

	// Finish by binding the Torre middleware
	app.param('torreId', torres.torreByID);
};
