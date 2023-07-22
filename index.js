const express = require("express");
const cookiesParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const app = express();

// middleware
app.use(cookiesParser())


const authorization = (req,res,next) => {
    const token = req.cookies.access_token;
    if(!token){
        res.sendStatus(403)
    }
    try{
        const data = jwt.verify(token,"DreamsAndBelieves")
        req.userId = data.id;
        req.userRole = data.role
        return next();
    }catch(error){
        return res.sendStatus(403);
    }
}

app.get('/',(req,res) => {
   return res.json({message: "Hello World 🇵🇹 🤘"})
})

app.get('/login',(req,res) => { 
    const token = jwt.sign({id:7,role:"captain"},"DreamsAndBelieves");
    return res.cookie("access_token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
    }).status(200).json({message:"succesfully token 😊 👌"})
})

app.get('/protected',authorization,(req,res)=>{
    return res.json({user:{id:req.userId,role:req.userRole}})
})
app.get('/logout',(req,res,next) => {
    return res.clearCookie('access_token').status(200).json({messsage:"successfully logout"});
})

const start = (port) => {
    try{
        app.listen(port,function(){
            console.log(`list http://localhost:${port}`)
        })
    }catch(error){
        console.error(error);
        process.exit();
    }
}
start(3000)