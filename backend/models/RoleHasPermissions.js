const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleHasPermissionsSchema = new Schema({
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    permission_id: {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    }
});

module.exports = mongoose.model('RoleHasPermissions', RoleHasPermissionsSchema);
