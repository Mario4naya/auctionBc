const express = require('express');
const errorHandler = require('../helpers/errorHandler');
const {Auction} = require('../models/auction');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv/config');
/**
 * Buscar todas las subastas
 */

router.post('/create', async(req,res)=>{
    try{
        let auction = new Auction({
            code: req.body.code,
            product_name:req.body.product_name,
            startPrice:req.body.startPrice,
            status: req.body.status,
            startDate:req.body.startDate,
            endDate: req.body.endDate,
            description:req.body.description,            
            profileImage: '',
            images: '',            
            endPrice:req.body.endPrice,
            user:req.body.user          
        });
    
        auction = await auction.save();
    
        if(!auction) return res.status(404).send('The auction cannot be created!')
        res.send(auction);
    }catch(e){
        let messages = [];
        console.log(e);
        for (let error of  Object.keys(e.errors)){            
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
 
});

module.exports = router;