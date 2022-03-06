const express = require('express');
const {User} = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

/**
 * find all without password
 */
router.get('/',async(req,res)=>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success:false});
    }
    res.send(userList);
});


/**
 * find one without password
 */
router.get('/:id',async(req,res)=>{
    try{
        const user  = await User.findById(req.params.id).select('-passwordHash');
        if(!user) return res.status(404).send({message:'User was not found.'});
        return res.send(user);
    }catch(e){
        return res.status(400).send(e);
    }
});

/**
 * login method
 */
router.post('/login',async(req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(user && bcrypt.compareSync(req.body.password,user.password)){
        
        let token = jwt.sign(
            {
                userId:user.id,
                isAdmin:user.isAdmin,
                isVerified:user.isVerified
            },
            process.env.SECRET_KEY,
            {
                expiresIn: 6000 * 6000
            }
        )
        token = process.env.PREFIX_TOKEN + token

        res.send({userEmail:user.email,token});

    }else{
        res.status(400).send('User or password is wrong');
    }
});

/**
 * metodo para recuperar la contraseña la cual recibe el email, y el telefono
 */
router.post('/recovery/password',async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user || !user.phoneNumber == req.body.phoneNumber) {
            res.status(400).send('The user o phone doesnt match.')
        };
    
        let updatedUser = await User.findByIdAndUpdate(
            user.id,    
            {
                passwordHash : bcrypt.hashSync(req.body.newPass,10)
            },{
                new:true
            }
            )
    
        if(!updatedUser)
        return res.status(500).send('The product cannot be updated')
    
        res.send(updatedUser);
    }catch(e){
        console.error(e)
        res.send(e)
    }
});

router.post('/register', async(req,res)=>{
    try{
        let user = new User({
            name: req.body.name,
            username:req.body.username,
            password:bcrypt.hashSync(req.body.password,10),
            phoneNumber: req.body.phoneNumber,
            address:req.body.address,
            city: req.body.city,
            nid:req.body.nid,
            status: req.body.status  ?? 'none',
            gender:req.body.gender,
            email: req.body.email,
            profileImage: '',
            isVerified: false,
            country:req.body.country,
            isAdmin:req.body.isAdmin
        });
    
        user = await user.save();
    
        if(!user) return res.status(404).send('The user cannot be created!')
        res.send(user);
    }catch(e){
        let messages = [];
        for (let error of  Object.keys(e.errors)){
            messages.push(e.errors[error].message);
        }
        res.status(400).send({errors: messages});
    }
 
});




module.exports = router;