const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var chatroomSchema = new Schema(
    {
        usernames: [{type: String, }],
    }
);

module.exports = mongoose.model('chatrooms', chatroomSchema);