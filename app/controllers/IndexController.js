



// const index = (req, res) => {
//     res.render('home')
//   };
  
  
  
  module.exports = {
    index : (req, res) => {
        console.log('home');
        res.render('home');        
      },
      loginForm : (req, res) => {
        console.log('loginform');
        res.render('loginForm');        
      }
  };