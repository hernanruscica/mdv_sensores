

const UserModel = require("../models/UserModel.js");




  module.exports = {   
   home : async (req, res) => {
    console.log('home');
    //let results = await UserModel.getAll();
    //let results = await UserModel.getByDni(28470361);      
    console.log('results')
    res.render('home', {user: req.session.user}); 
    },
    loginForm: (req, res) => {
        console.log("loginForm");        
        if (req.session.user == undefined){
          res.render('loginForm');
        }else{
          res.render('dashboard', {user: req.session.user});
        }
    },
    registerForm: (req, res) => {
      console.log("registerForm");      
      res.render('registerForm', {user: req.session.user});      
    }
  }

