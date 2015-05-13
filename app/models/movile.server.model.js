'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Movile Schema
 */
var MovileSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Movile name',
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

mongoose.model('Movile', MovileSchema);