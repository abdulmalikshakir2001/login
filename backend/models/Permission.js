const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    module: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Permission', PermissionSchema);
