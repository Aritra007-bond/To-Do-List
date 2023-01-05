//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
//const date = require(__dirname + "/date.js");

//console.log(date);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB").catch(error => handleError(error));

const app = express();



// same applies to objects we cannot assign new objec t to a const object but can change its value by grabing the key.



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //used to access the files in a folder called public e.g css,js and etc

//const items = ["Study","Eat Food","Sleep"];//we can push values in javascript array even if it is a const but we cannot assign a new array to it like my_array = ['3','2']
//const workItems = [];
const itemSchema = mongoose.Schema({
  name:"String"
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name:"Welcome to your todolist"
});

const item2 = new Item({
  name:"Hit the + button to add new items to the list"
});

const item3 = new Item({
  name:"<-- hit this to delete an item."
});

const defaultItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items : [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/",function(req,res){

  Item.find({},function(err,foundItems){
    if (foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if (err){
          console.log(err);
        }else{
          console.log("Succesfully inserted to DB");
        }
        res.redirect("/")
      });
    }else{
        res.render("list", {listTitle:"Today" , newListItems: foundItems});
    }


  });
 //var day = date.getDate();
});

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName) ;

    List.findOne({name:customListName}, function(err , foundList){
      if(!err){
        if (!foundList){
          // create new list
          const list = new List({
            name : customListName,
            items : defaultItems
          });

          list.save();
          res.redirect("/" + customListName);

        }else{
          // show the existing list
          res.render("List" , {listTitle: foundList.name , newListItems: foundList.items})
        }
      }
    });

});

app.post("/", function(req,res){
  const itemName =  req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName

  });

  if (listName === "Today"){
    item.save();
    res.redirect("/")
  }else{
    List.findOne({name: listName}, function(err , foundList){

      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);

    })
  }


// if (req.body.list == "Work List"){
//   workItems.push(item);
//   res.redirect("/work");
// }else{
//   items.push(item);
//   res.redirect("/")
// }

});

app.post("/delete", function (req,res) {

//  console.log(req.body.checkbox);//returns on
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){

    Item.findByIdAndRemove(checkedItemId,function(err){ //passingb the call back function is mandatory here unlike others or it will not delete
      if(!err){
        console.log("Succesfully deleted");

        res.redirect("/" );
      }
    });
  }else{
      List.findOneAndUpdate({name : listName},{$pull : {items:{_id : checkedItemId}}}, function(err , foundList){
          if(!err){
            res.redirect("/" + listName);
          }

      });

  }



});

// app.get("/work", function(req,res){
//   res.render("list",{listTitle:"Work List",newListItems: workItems})
// });

app.get("/about", function(req,res){

  res.render("about");
});
// app.post("/work", function(req,res){
//  let item = req.body.newItem;
//
//  workItems.push(item);
//
//  res.redirect("/work");
// })


app.listen(3000,function(){
  console.log("server started at port 3000")
});

//if else way instead of swtch case.
// if(currentDay ===6 || currentDay === 0) {
//   day ="weekend";
//   // res.send("ayay its a weekend");
//   // res.render("list", {kindOfDay:day})
// }else{
//   day= "weekday";
//   // res.render("list", {kindOfDay:day}) we can write it after the if else statement before the end of app.get to avoid it from repeat.
//   // res.write("working day");
//   // res.write("booo! itss a weekday");
//   // res.send();
// }
