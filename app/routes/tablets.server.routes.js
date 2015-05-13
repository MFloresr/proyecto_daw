'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tablets = require('../../app/controllers/tablets.server.controller');

	// Tablets Routes
	app.route('/tablets')
		.get(tablets.list)
		.post(users.requiresLogin, tablets.create);

	app.route('/tablets/:tabletId')
		.get(tablets.read)
		.put(users.requiresLogin, tablets.hasAuthorization, tablets.update)
		.delete(users.requiresLogin, tablets.hasAuthorization, tablets.delete);

	// Finish by binding the Tablet middleware
	app.param('tabletId', tablets.tabletByID);
};
