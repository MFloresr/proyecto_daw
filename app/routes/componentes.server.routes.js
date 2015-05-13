'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var componentes = require('../../app/controllers/componentes.server.controller');

	// Componentes Routes
	app.route('/componentes')
		.get(componentes.list)
		.post(users.requiresLogin, componentes.create);

	app.route('/componentes/:componenteId')
		.get(componentes.read)
		.put(users.requiresLogin, componentes.hasAuthorization, componentes.update)
		.delete(users.requiresLogin, componentes.hasAuthorization, componentes.delete);

	// Finish by binding the Componente middleware
	app.param('componenteId', componentes.componenteByID);
};
