'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tablet Schema
 */
var TabletSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tablet name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tablet', TabletSchema);