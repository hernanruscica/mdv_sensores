



  module.exports = {   
   home : async (req, res) => {
    console.log('home');
     
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
    }
  }

