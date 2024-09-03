const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
