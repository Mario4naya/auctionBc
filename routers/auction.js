const express = require('express');
const errorHandler = require('../helpers/errorHandler');
const {Auction} = require('../models/auction');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv/config');


//buscar subasta por 1 categoría
router.get('/auct_by_category', async(req,res) =>{
    try{
        const auction  = await Auction.findById(req.params.id).select('-passwordHash');
        if(!auction) return res.status(404).send({message:'Auction was not found.'});
        return res.send(user);
    }catch(e){
        return res.status(400).send(e);
    }
})

//buscar todas las subastas
router.get('/allauctions', async(req,res) =>{
    const auctionList = await Auction.find().select('-passwordHash');

    if(!auctionList){
        res.status(500).json({success:false});
    }
    res.send(auctionList);
})

//Crea subasta
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
            category:req.body.category,
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