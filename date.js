//jshint esversion:6

module.exports.getDate = getDate; //we r not adding the () in the function coz we r not calling the function yet we dont want to call it in module we want app js to determine when to call it.


// we can have multiple function in a single module with the help of this
function getDate() {

  var today = new Date();
  // var currentDay = today.getDay();
  // var day = "";

  var options = {
    weekday:"long",
    day:"numeric",
    month: "long"

  };

  return today.toLocaleDateString("en-US",options);

  // return date
}

module.exports.getDay = getDay;//we know module.export is a javascript object so we get methods assigned with it and we can specify the perticullar objects assosiated with it and assign specific values..

function getDay() {

  var today = new Date();
  // var currentDay = today.getDay();
  // var day = "";

  var options = {
    weekday:"long",


  };

  return today.toLocaleDateString("en-US",options);

  // return day
}
