const express = require('express');
const errorHandler = require('../helpers/errorHandler');
const {Category} = require('../models/category');
const router = express.Router();
const jwt = require('jsonwebtoken');


/**
 * get all categories
 */
router.get('/all', async(req,res)=>{
    const categoryList = await Category.find();

    if(!categoryList) res.status(500).json({success:false})

    res.send(categoryList);

})


router.get('/:id',async(req,res)=>{
    //try{
        const category  = await Category.findById(req.params.id);
        if(!category) return res.status(404).send({message:'Category was not found.'});
        return res.send(category);
    //}catch(e){
    //    return res.status(400).send(e);
    //}
});


router.post('/', async(req,res)=>{

    const isAdmin = jwt.decode(req.headers.authorization.split(' ')[1]).isAdmin
    if(!isAdmin) return res.status(400).send('Autorización requerida.');
    
    let category = new Category({
        name: req.body.name,
        description:req.body.description,
        icon:null
    });
    
    category = await category.save();
    if(!category) return res.status(404).send('The category cannot be created!')
    res.send(category);
});

router.put('/:id', async(req,res)=>{
    const isAdmin = jwt.decode(req.headers.authorization.split(' ')[1]).isAdmin
    if(!isAdmin) return res.status(400).send('Autorización requerida.');
    
    const category  = await Category.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        description:req.body.description,
        icon:null
    },{
        new:true
    })
    if(!category) return res.status(404).send('The category cannot be created!')
    res.send(category);
});


router.delete('/:id',async(req,res)=>{

    const isAdmin = jwt.decode(req.headers.authorization.split(' ')[1]).isAdmin
    if(!isAdmin) return res.status(400).send('Autorización requerida.');
    
    Category.findByIdAndDelete(req.params.id).then(category =>{
        if(category){
            return res.status(200).json({success:true,message:'The category was deleted.'});
        }else{
            return res.status(404).json({success:false,message:'The category was not found'});
        }
    }
    ).catch(e=>{
        	return res.status(400).json({success:false,error:e});
    });
});


module.exports = router;