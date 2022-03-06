const express = require('express');
const errorHandler = require('../helpers/errorHandler');
const { Auction } = require('../models/auction');
const {Offer} = require('../models/offer');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');


/**
 * get all offers by auction id
 *  */
router.get('/allByAuction', async(req,res)=>{
    const auctionId = req.query.auctionId;
    const offerList = await  Offer.find({
        auction:auctionId
    }).sort({offerValue:-1}).populate('auction','_id ').populate('user','_id')

    if(!offerList) res.status(500).json({success:false})
    res.send(offerList);

})

/**
 * Obtenemos una oferta por su id
 */

router.get('/offerById',async(req,res)=>{
    try{
        const offer  = await Offer.findById(req.query.id).populate('auction');
        if(!offer) return res.status(404).send({message:'offer was not found.'});
        return res.send(offer);
    }catch(e){
        let messages = [];
        for (let error of  Object.keys(e.errors)){
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
});


/**
 * Creacion de una offerta para una categoria
 */
router.post('/create', async(req,res)=>{ 
    try{
        const payload = jwt.decode(req.headers.authorization.split(' ')[1])

        if(!payload.isVerified) return res.status(400).send('Verificación requerida.');
    
        let offer = new Offer({
            user: payload.userId,
            offerValue:req.body.offerValue,
            offerDate:Date.now(),
            auction :req.body.auction
        });
        let validations = await validation(offer)
        if(!validations[0]){
            return res.status(200).send({success:false,message:validations.slice(1)})
        }
    
        let offerSaved = await offer.save();
    
        if(!offerSaved) return res.status(404).send('The offer cannot be created!')
        res.send(offerSaved);
    }catch(e){
        let messages = [];
        for (let error of  Object.keys(e.errors)){
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
    
});

/**
 * Actualizacion de una oferta donde se puede actualizar el valor 
 */
router.put('/:id', async(req,res)=>{
    try{
        const isVerified = jwt.decode(req.headers.authorization.split(' ')[1]).isVerified
        if(!isVerified) return res.status(400).send('Verificación requerida.');

        let offer = await Offer.findById(req.params.id)
        offer.offerValue = req.body.offerValue
        offer.offerDate = Date.now()
        let validations = await validation(offer,req.params.id)
        if(!validations[0]){
            return res.status(200).send({success:false,message:validations.slice(1)})
        }
        const offerSaved  = await Offer.findByIdAndUpdate(req.params.id,{        
            offerValue:req.body.offerValue,
            offerDate:Date.now()
        },{
            new:true
        })
        if(!offerSaved) return res.status(404).send('The offer cannot be created!')
        res.send(offerSaved);
    }catch(e){
        let messages = [];
        for (let error of  Object.keys(e.errors)){
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
});


router.delete('/:id',async(req,res)=>{

    const userId = jwt.decode(req.headers.authorization.split(' ')[1]).userId
    
    var offer = await Offer.findById(req.params.id)

    if(offer && offer.user === userId){
        Offer.findByIdAndDelete(req.params.id).then(offer =>{
            if(offer){
                return res.status(200).json({success:true,message:'The offer was deleted.'});
            }else{
                return res.status(404).json({success:false,message:'The offer was not found'});
            }
        }
        ).catch(e=>{
                return res.status(400).json({success:false,error:e});
        });
    }else{
        return res.status(404).json({success:false,message:'The offer was not found or the offer is not yours '});
    }


});


const validation = async  function(offer,offerId){
    let validations = []
    validations.push(true)
    let maxOffert;

    if(offerId){
        maxOffert = await  Offer.find({
            auction:offer.auction,
            _id: {$ne:offerId}
        }).sort({offerValue:"desc"}).limit(1);
    }else{
        maxOffert = await  Offer.find({
            auction:offer.auction
        }).sort({offerValue:"desc"}).limit(1);
    }
    console.log(maxOffert)

    const auction = await Auction.findById(offer.auction);

    if(offer.offerValue <= auction.startPrice){
        validations.push("El valor minimo de la oferta debe ser mayor a:" + auction.startPrice)        
    }
  

    if((auction.endDate < (offer.offerDate ?? Date.now())) || auction.status == "closed"){
        validations.push("La subasta ya no está disponible")
    }
  

    if(maxOffert.length > 0 && (maxOffert[0].offerValue >= offer.offerValue)){
        validations.push("El valor minimo de la oferta debe ser mayor a:" + maxOffert[0].offerValue)
    }
   

    if(validations.length > 1){
        validations[0] = false
    }


    return validations

}



module.exports = router;