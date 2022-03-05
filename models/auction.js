const mongoose = require('mongoose');


const auctionSchema = mongoose.Schema({
    code:{
        type: String,
        
        unique: true
    },
    product_name:{
        type: String,
        required: true
    },
    startPrice :{
        type: mongoose.Types.Decimal128,
        required: true
    },
    status :{
        type: String
    },
    startDate:{
        type: Date,
        default:Date.now,        
    },
    endDate :{
        type: Date,
        required: true
    },    
    description :{
        type: String,
        
    },
    profileImage :{
        type: String,
        default: '',
        
    },
    images:[{
        type: String
    }]
    ,
    endPrice :{
        type:mongoose.Types.Decimal128,        
    },

    category :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',                 
    },

    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true 
    }

});

exports.Auction = mongoose.model('Auction',auctionSchema);