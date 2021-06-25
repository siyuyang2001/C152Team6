'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var listSchema = Schema( {
  userId: ObjectId,
  key: String,
  amount: String,
} );

module.exports = mongoose.model( 'List', listSchema );
