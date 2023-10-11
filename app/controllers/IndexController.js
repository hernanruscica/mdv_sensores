

const UserModel = require("../models/UserModel.js");




  module.exports = {   
   home : async (req, res) => {
    console.log('home');
    //let results = await UserModel.getAll();
    //let results = await UserModel.getByDni(28470361);      
    console.log('results')
    res.render('home'); 
    },
    loginForm: (req, res) => {
      console.log("loginForm");
      res.render('loginForm');
    }
  }

