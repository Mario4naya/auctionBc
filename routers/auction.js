const express = require('express');
const errorHandler = require('../helpers/errorHandler');
const {Auction} = require('../models/auction');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv/config');


//buscar todas las subastas
router.get('/all/all_auctions',async(req,res)=>{
    const auctionList = await Auction.find();

    if(!auctionList){
        res.status(500).json({success:false});
    }
    res.send(auctionList);
});

//Buscar subasta por ID
router.get('/:id',async(req,res)=>{
    try{
        const auction  = await Auction.findById(req.params.id);
        if(!auction) return res.status(404).send({message:'auction was not found.'});
        return res.send(auction);
    }catch(e){
        let messages = [];
        for (let error of  Object.keys(e.errors)){
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
});

//Buscar subasta por categoría
router.get('/auction_Category/:category',async(req,res)=>{
    try{    
        const auctionList = await Auction.find();
        var  aucts = [];

        if(!auctionList){
        res.status(500).json({success:false});
        }    
        
        for(auct in auctionList)
        {
            try
            {
                if(auctionList[auct].category == req.params.category)
                {
                    aucts.push(auctionList[auct]);
                } 
            }catch{}                       
        }
        return res.send(aucts);
    }catch(e){
        let messages = [];
        for (let error of  Object.keys(e.errors)){
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
    
});

//Buscar subasta por nombre
router.get('/auction_name/:name',async(req,res)=>{
    try{    
        const auctionList = await Auction.find();
        var  aucts = [];

        if(!auctionList){
        res.status(500).json({success:false});
        }    
        
        for(auct in auctionList)
        {
            try
            {
                if(auctionList[auct].product_name.includes(req.params.name))
                {
                    aucts.push(auctionList[auct]);
                } 
            }catch{}                       
        }
        return res.send(aucts);
    }catch(e){
        let messages = [];
        for (let error of  Object.keys(e.errors)){
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
    
});


//Crea subasta
router.post('/create', async(req,res)=>{
    try{
        const userId = jwt.decode(req.headers.authorization.split(' ')[1]).userId
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
            user:userId       
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


//Eliminar una subasta por su ID
router.delete('/eliminar/:id',async(req,res)=>{

    const userId = jwt.decode(req.headers.authorization.split(' ')[1]).userId
    var auction = await Auction.findById(req.params.id)

    if(auction && auction.user === userId){
        auction.findByIdAndDelete(req.params.id).then(auction =>{
            if(auction){
                return res.status(200).json({success:true,message:'The auction was deleted.'});
            }else{
                return res.status(404).json({success:false,message:'The auction was not found'});
            }
        }
        ).catch(e=>{
                return res.status(400).json({success:false,error:e});
        });
    }else{
        return res.status(404).json({success:false,message:'The auction was not found or the auction is not yours '});
    }


});

// Cerrar manualmente una oferta 
router.put('/close_auction/:id', async(req,res)=>{
    try{
        const userId = jwt.decode(req.headers.authorization.split(' ')[1]).userId
        let auction = await Auction.findById(req.params.id)
        if(auction.user != userId) return res.status(400).send('The auction is not yours.')
        auction.status = "Cerrada"       
        let validations = await validation(auction,req.params.id)
        if(!validations[0]){
            return res.status(200).send({success:false,message:validations.slice(1)})
        }
        const auctionSaved  = await auction.findByIdAndUpdate(req.params.id,{        
            auctionValue:req.body.auctionValue,           
        },{
            new:true
        })
        if(!auctionSaved) return res.status(404).send('The auction cannot be updated!')
        res.send(auctionSaved);
    }catch(e){
        let messages = [];
        for (let error of  Object.keys(e.errors)){
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
});



module.exports = router;