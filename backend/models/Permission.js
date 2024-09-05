const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    modules: { // Changed from 'module' to 'modules' and made it an array
        type: [String], // This will hold an array of module names
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Permission', PermissionSchema);
