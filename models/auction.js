const mongoose = require('mongoose');


const auctionSchema = mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    name:{
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
    product :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    },
    description :{
        type: String,
        required: true
    },
    profileImage :{
        type: String,
        default: '',
        required: true
    },
    images:[{
        type: String
    }]
    ,
    endPrice :{
        type:mongoose.Types.Decimal128,
        required: true
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }

});

exports.Auction = mongoose.model('Auction',auctionSchema);