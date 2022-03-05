const mongoose = require('mongoose');


const validateEmail = (email) =>{
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
}

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true,
    },
    phoneNumber:{
        type:String,
        
    },
    address:{
        type: String,
        
    },
    city:{
        type: String,
        
    },
    country:{
        type:String,
        
    },
    nid:{
        type:String,
        
    },
    status:{
        type:String
    },
    gender:{
        type:String,
        enum: ['F','M']
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        required:'Email address is required',
        validate: [validateEmail,'Please fill a valid email address']
    },
    profileImage:{
        type: String,
        default: ''
    },
    isVerified:{
        type:Boolean
    },
    isAdmin:{
        type:Boolean
    }

});


exports.User = mongoose.model('User', userSchema);
