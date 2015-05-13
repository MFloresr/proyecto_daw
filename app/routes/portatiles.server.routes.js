'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portatiles = require('../../app/controllers/portatiles.server.controller');

	// Portatiles Routes
	app.route('/portatiles')
		.get(portatiles.list)
		.post(users.requiresLogin, portatiles.create);

	app.route('/portatiles/:portatileId')
		.get(portatiles.read)
		.put(users.requiresLogin, portatiles.hasAuthorization, portatiles.update)
		.delete(users.requiresLogin, portatiles.hasAuthorization, portatiles.delete);

	// Finish by binding the Portatile middleware
	app.param('portatileId', portatiles.portatileByID);
};
