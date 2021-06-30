
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var gamesSchema = Schema( {
  gamename:String,
  score: String,
  date: Date,
  shortDescription: String,
  userId: ObjectId

} );

module.exports = mongoose.model( 'Game', gamesSchema );
