const express= require('express')
const morgan= require('morgan')
const bodyParser= require('body-parser')
const request=require('request')
const async= require('async')
var exphbs  = require('express-handlebars');
const session= require('express-session')
const MongoStore= require('connect-mongo')(session)
const flash =require('express-flash')

const app= express()
const port = 8080
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'))
app.use(session({
       resave:true,
       saveUninitialized: true,
       secret: 'qpeieiepkfdujale',
       store: new MongoStore({url: 'mongodb://<databaseUser:<databasePassword>ds123562.mlab.com:23562/<databseName>'})
}))
app.use(flash())
//req.flash()   

            
app.route('/')
   .get((req,res,next)=>{
      res.render('main/home', {message: req.flash('success')})
   })
   .post((req,res,next)=>{
      request({
          url: 'https://us19.api.mailchimp.com/3.0/lists/aeaf4ec40d/members',
          method: 'POST',
          headers:{
              'Authorization': 'randomUser 0d4826178962ca2b9a2c5ef2010c8144-us19',
              'Content-Type': 'application/json'
          },
          json:{
              'email_address': req.body.email,
              'status': 'subscribed'
          }

      }, function(err,response,body){
          if (err){
            console.log(err)  
          }else {
              req.flash('success', 'You have submitted your email')
              res.redirect('/')
          }
      }

    )
   })




 app.listen(port, ()=>{
     console.log(`listing on ${port}`)
 })
