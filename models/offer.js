const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    offerValue:{
        type: mongoose.Types.Decimal128,
        required: true
    },
    offerDate:{
        type: Date,
        default: Date.now
    },
    auction :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    }

});


exports.Offer = mongoose.model('Offer', offerSchema);
