const express = require('express'); //including express packages 
const bodyParser  = require('body-parser'); // middleware 
const ejs = require('ejs'); // importing ejs modules
const mongoose = require('mongoose'); // importing mongoose packages 



const app = express(); // creating instance of epxress 
app.set('view engine', 'ejs'); // setting view engine ejs for express application 
app.use(bodyParser.urlencoded({extended:true})); // parsing url encoded request using qs library 
app.use(express.static('public')); // middleware of static files 



const today = new Date() ;    
const options = { weekday:'long' , year : 'numeric' , month : 'long' , day : "numeric"} ; 
const date = today.toLocaleDateString("en-US",options) ; 

mongoose.connect('mongodb://127.0.0.1:27017/todolistdb')
.then(() => {
    console.log('Connected to MongoDB');
  }); // connecting to database todolistdb

const itemSchema = { // schema 
    name : String 
}; 

const item   = mongoose.model('Item' , itemSchema) ; // model 

// document 
const item1 = new item({
    name : 'playing'
});
const item2 = new item({
    name : 'eating'
});
const defualtItems = [item1 , item2 ] ; 
/*

item.insertMany(defualtItems)
.then (function(docs){
    console.log("document inserted " + docs.length );
})
.catch (function(err){
    console.log(err) ; 
}); */ 

const listSchema = {
    name : String , 
    listName : [itemSchema]
}
const list = new mongoose.model('list' , listSchema) ;


app.get('/:reqParam', function(req,res){
    
    list.findOne({name : req.params.reqParam})
    .then(result => {
        
        if (!result){
            const list1 = new list({
                name :req.params.reqParam ,
                listName : defualtItems
            });
            list1.save();
            res.redirect('/' + req.params.reqParam);
        }
        else {
            res.render('index' , {item_list_name : result.listName , title : req.params.reqParam });
        }
    })
});



app.get('/' ,  function(req,res){
    item.find()
    .then ( result => {
        if (result.length === 0 ){
            item.insertMany(defualtItems).catch(function(error){
                console.log("error occured" + error) ; 
            });
            
        }
        else {
            res.render('index' , {item_list_name : result , title : date }) ; 
        }
    })
    .catch(error => {
        console.log("error occured" + error);
    })
    
});


 
app.post('/' , function(req , res){

        const newitem  = new item({
            name : req.body.list_item 
        });
        newitem.save(); 
    
     
    if ( req.body.name === 'Work list'){ 
        res.redirect("/work"); 
    }
    else {
        res.redirect("/");
    }
    
});
app.post("/delete" , function (req, res) {
    item.deleteOne({name : req.body.checked }).catch(error => {
        console.log(error); 
    })
    res.redirect("/");
})

app.listen('3000', function(){
    console.log('app is listening on port 3000');
});