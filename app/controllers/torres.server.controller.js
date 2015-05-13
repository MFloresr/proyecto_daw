'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Torre = mongoose.model('Torre'),
	_ = require('lodash');

/**
 * Create a Torre
 */
exports.create = function(req, res) {
	var torre = new Torre(req.body);
	torre.user = req.user;

	torre.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(torre);
		}
	});
};

/**
 * Show the current Torre
 */
exports.read = function(req, res) {
	res.jsonp(req.torre);
};

/**
 * Update a Torre
 */
exports.update = function(req, res) {
	var torre = req.torre ;

	torre = _.extend(torre , req.body);

	torre.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(torre);
		}
	});
};

/**
 * Delete an Torre
 */
exports.delete = function(req, res) {
	var torre = req.torre ;

	torre.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(torre);
		}
	});
};

/**
 * List of Torres
 */
exports.list = function(req, res) { 
	Torre.find().sort('-created').populate('user', 'displayName').exec(function(err, torres) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(torres);
		}
	});
};

/**
 * Torre middleware
 */
exports.torreByID = function(req, res, next, id) { 
	Torre.findById(id).populate('user', 'displayName').exec(function(err, torre) {
		if (err) return next(err);
		if (! torre) return next(new Error('Failed to load Torre ' + id));
		req.torre = torre ;
		next();
	});
};

/**
 * Torre authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.torre.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
