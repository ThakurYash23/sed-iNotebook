// This file will contain all the ROUTES required for users authorization and authentication. i.e. createuser, login, getuser etc

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Yashisagoogb%oy";  // Ideally Secret Key Should be stored in env files or some common place that is not public

// ROUTE 1: Create a user using : POST "/api/user/createuser". Doesn't require Auth. No login required

router.post('/createuser', [
    body('name', "Enter a valid name.").isLength({min: 3}),
    body('email').isEmail(),  // custom error msg is optional here like in name
    body('password', "Password must have atleast 5 Character.").isLength({min: 5})
], async(req, res) => {
    let success = false; // Will send it with authtoken to frontend
    // if there are errors then return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array() });
    }
    // check whether the user with this email already exist.
    try{
        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({success, error:"Sorry a user with this email already exist."})
        }
        // Applying hashing and salting thing on password for security reasons
         const salt = await bcrypt.genSalt(10);
         const secPass = await bcrypt.hash(req.body.password, salt); // bcrypt automatically handles the storing thing of salt no need to manually save salt in DB
        // Creating a user here
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);  // JWT has 3 part Algopart + Payload we sent + Secret 
        success = true;
        res.json({success, authToken});
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }
}); 


//ROUTE 2:  Authenticate a user using : POST "/api/user/login". No login required

router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password can not be blank").exists()
], async(req, res) => {
    let success = false; // Do this success true and false work for all endpoints
    // if there are errors then return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success, error: "Please try to login with correct credentials."})
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success, error: "Please try to login with correct credentials."})
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);  // JWT has 3 part Algopart + Payload we sent + Secret
        success = true;
        res.json({success, authToken});  // returning authToken to user
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE 3:  Get loogedin user details using : POST "/api/user/getuser". login required

router.post('/getuser', fetchuser, async(req, res) => {  // fetchusr is a middleware(function) that returns user data from jwt token
    try{
        const userID = req.user.id;
        const user = await User.findById(userID).select("-password");  // selecting all user's field except password
        res.send(user);
    } 
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }   
})
module.exports = router;