'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Componente = mongoose.model('Componente'),
	_ = require('lodash');

/**
 * Create a Componente
 */
exports.create = function(req, res) {
	var componente = new Componente(req.body);
	componente.user = req.user;

	componente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(componente);
		}
	});
};

/**
 * Show the current Componente
 */
exports.read = function(req, res) {
	res.jsonp(req.componente);
};

/**
 * Update a Componente
 */
exports.update = function(req, res) {
	var componente = req.componente ;

	componente = _.extend(componente , req.body);

	componente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(componente);
		}
	});
};

/**
 * Delete an Componente
 */
exports.delete = function(req, res) {
	var componente = req.componente ;

	componente.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(componente);
		}
	});
};

/**
 * List of Componentes
 */
exports.list = function(req, res) { 
	Componente.find().sort('-created').populate('user', 'displayName').exec(function(err, componentes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(componentes);
		}
	});
};

/**
 * Componente middleware
 */
exports.componenteByID = function(req, res, next, id) { 
	Componente.findById(id).populate('user', 'displayName').exec(function(err, componente) {
		if (err) return next(err);
		if (! componente) return next(new Error('Failed to load Componente ' + id));
		req.componente = componente ;
		next();
	});
};

/**
 * Componente authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.componente.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
