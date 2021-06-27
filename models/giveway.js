const mongoose = require('mongoose');

const gwSchema = new mongoose.Schema({
    ended: Boolean,
    ends: String,
    user: String,
    guild: String,
    winner: [String],
    mid: String,
    prize: String,
    invite: String,
    id: String
});

const gwModel = module.exports = mongoose.model('Giveaways', gwSchema);