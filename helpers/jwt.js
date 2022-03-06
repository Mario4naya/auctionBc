const expressJwt = require('express-jwt');

function authJwt(){
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;
    return expressJwt(
    {
        secret,
        algorithms:['HS256'],
        isRevoked:isRevoked
    }).unless(
        {
            path:[
                {url: /\/public\/uploads(.*)/ ,methods:['GET','OPTIONS']},
                {url: /\/subasta\/api\/users(.*)/ ,methods:['GET','OPTIONS']},
                {url: /\/subasta\/api\/categories(.*)/ ,methods:['GET','OPTIONS']},
                {url: /\/subasta\/api\/auctions(.*)/ ,methods:['GET','OPTIONS']},
                {url: /\/subasta\/api\/offers(.*)/ ,methods:['GET','OPTIONS']},
                `${api}/users/login`,
                `${api}/users/register`,
                `${api}/auctions/create`
            ]
        }
    )
}


async function isRevoked(req,payload,done){
    // if(!payload.isAdmin){
    //     return done(null,true);
    // }
    // not working like i expected, it revoke  all user actions and i dont want that behavior
    done();
}

module.exports = authJwt;