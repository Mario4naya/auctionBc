const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code:{
        type: String,
        required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description:{
        type: String,
        required:true
    }
});


exports.Product = mongoose.model('Product', productSchema);
