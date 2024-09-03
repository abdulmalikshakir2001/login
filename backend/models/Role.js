const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role', RoleSchema);
