const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelHasRolesSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
});

module.exports = mongoose.model('ModelHasRoles', ModelHasRolesSchema);
