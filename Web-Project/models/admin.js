// admin model

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


adminSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

adminSchema.methods.comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password,hash)
}

let Admin = mongoose.model('Admin', adminSchema, 'admin')

module.exports = Admin;
