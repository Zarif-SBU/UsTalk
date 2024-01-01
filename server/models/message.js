const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var messageSchema = new Schema(
    {
        username: {type: String, },
        chatroomId: {type: Schema.Types.ObjectId, ref: 'Chatroom'},
        date: {type: Date, required: true, default: new Date()}
    }
);

module.exports = mongoose.model('messages', messageSchema);