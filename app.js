//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');


// connect to mongoDB
mongoose.connect("mongodb+srv://papiwolfy:jaysn@999@cluster0.hgwim.mongodb.net/wikiDB?retryWrites=true/wikiDB", 
{useNewUrlParser: true, useUnifiedTopology: true});  

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// collection
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);



// // fetch all the articles ----- GET
// app.get("/articles", function(req, res) {
//     Article.find({},function(err, foundArticles){
//       if(!err) {
//         res.send(foundArticles);
//       } else {
//         res.send(err);
//       }
//     });
// });

// // creating a new article and snding it back to our server and web page without using HTML forms ----------POST
// app.post('/articles', function(req, res){
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//   newArticle.save(function(err){
//     if(!err){
//       res.send("Successfully added a new Article");
//     } else{
//       res.send(err);
//     }
//   });
// });

// // delete all the articles that------DELETED
// app.delete("/articles", function(req, res){
//   Article.deleteMany({}, function(err){
//     if(!err){
//       res.send("Successfully deleted all Articles")
//     } else {
//     res.send(err);
//     }
//   })
// })






// clean way of routing to same route single route

app.route("/articles")

.get(function(req, res) {
    Article.find({},function(err, foundArticles){
      if(!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new Article");
    } else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany({}, function(err){
    if(!err){
      res.send("Successfully deleted all Articles")
    } else {
    res.send(err);
    }
  });
});





// request targeting a specifit article

app.route('/articles/:articleTitle')
.get(function(req, res){
  // const articleTitle = req.params.articleTitle 
  Article.findOne({title:req.params.articleTitle }, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found");
    }

  })
})

//updating the article at specific route-------PUT
.put(function(req, res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {
    title:req.body.title,
    content:req.body.content
  },
  {overwrite: true}, 
  function(err) {
    if(!err){
      res.send("successfully updated article");
    }
  }
  )
})

//updating the article at specific route-------PATCH
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},  // req.body will let user choose what they want to update 
    function(err){
      if(!err){
        res.send("Successfully Updated the selected Article");
      } else {
        res.send(err);
      }
    }
  )
})

//Delete specific article
.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err){
      res.send("Successfully deleted selected article")
    } else{
      res.send(err);
    }
  })
});


//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});