function errorHandler(err,req,res,next){
    if(err){
        return res.status(err.status).send({message:err.message});
    }
}

module.exports = errorHandler;