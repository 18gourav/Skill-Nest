import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username : {
        type: String,
        required:true,
        unique:true,
        trim: true,
        index:true
    },
    emailId : {
        type: String,
        required:true,
        unique:true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim:true,
        index:true
    },
    password: {
        type: String,
        required: false,
        minlength: 6,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    enrolledCourses: [{
        type: Schema.Types.ObjectId,
        ref: "Course"
    }]
}, {timestamps: true}
)


// middleware and hooks
userSchema.pre('save', async function(next) {
    if(!this.isModified('password') || !this.password) return next();
        
    this.password = await bcrypt.hash(this.password, 10)
    next();
})
  
userSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password, this.password)
}

//use of jwt
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            emailId : this.emailId,
            fullName : this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id : this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)