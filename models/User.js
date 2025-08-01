const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] // Basic email validation
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Define possible user roles
      default: 'user'
    }
  });
  
// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next(); // Only hash if password is new or modified
try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
} catch (error) {
    next(error);
}
});

// Method to compare passwords for login
userSchema.methods.comparePassword = async function (candidatePassword) {
return bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login date
userSchema.methods.updateLastLogin = function() {
this.lastLogin = Date.now();
return this.save();
};

const User = mongoose.model('User', userSchema);
  
module.exports = User;