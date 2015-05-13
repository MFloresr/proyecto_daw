'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Movile = mongoose.model('Movile'),
	_ = require('lodash');

/**
 * Create a Movile
 */
exports.create = function(req, res) {
	var movile = new Movile(req.body);
	movile.user = req.user;

	movile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movile);
		}
	});
};

/**
 * Show the current Movile
 */
exports.read = function(req, res) {
	res.jsonp(req.movile);
};

/**
 * Update a Movile
 */
exports.update = function(req, res) {
	var movile = req.movile ;

	movile = _.extend(movile , req.body);

	movile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movile);
		}
	});
};

/**
 * Delete an Movile
 */
exports.delete = function(req, res) {
	var movile = req.movile ;

	movile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movile);
		}
	});
};

/**
 * List of Moviles
 */
exports.list = function(req, res) { 
	Movile.find().sort('-created').populate('user', 'displayName').exec(function(err, moviles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(moviles);
		}
	});
};

/**
 * Movile middleware
 */
exports.movileByID = function(req, res, next, id) { 
	Movile.findById(id).populate('user', 'displayName').exec(function(err, movile) {
		if (err) return next(err);
		if (! movile) return next(new Error('Failed to load Movile ' + id));
		req.movile = movile ;
		next();
	});
};

/**
 * Movile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.movile.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
