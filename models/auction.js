const mongoose = require('mongoose');


const auctionSchema = mongoose.Schema({
    code:{
        type: String,
        required: true,
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
        required: true
    },
    endDate :{
        type: Date,
        required: true
    },    
    description :{
        type: String,
        required: true
    },
    profileImage :{
        type: String,
        default: '',
        required: false
    },
    images:[{
        type: String
    }]
    ,
    endPrice :{
        type:mongoose.Types.Decimal128,        
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }

});

exports.Auction = mongoose.model('Auction',auctionSchema);