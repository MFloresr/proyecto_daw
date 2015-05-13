'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var moviles = require('../../app/controllers/moviles.server.controller');

	// Moviles Routes
	app.route('/moviles')
		.get(moviles.list)
		.post(users.requiresLogin, moviles.create);

	app.route('/moviles/:movileId')
		.get(moviles.read)
		.put(users.requiresLogin, moviles.hasAuthorization, moviles.update)
		.delete(users.requiresLogin, moviles.hasAuthorization, moviles.delete);

	// Finish by binding the Movile middleware
	app.param('movileId', moviles.movileByID);
};
