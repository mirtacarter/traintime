// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyBDeKtwJedSmGkEiTGsYeYbEVTHAqod7ZU",
    authDomain: "traintime-b7a31.firebaseapp.com",
    databaseURL: "https://traintime-b7a31.firebaseio.com",
    projectId: "traintime-b7a31",
    storageBucket: "traintime-b7a31.appspot.com",
    messagingSenderId: "442473295443"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = $("#time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
  
    // Create local temp object 
    var newTrain = {
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency
    };
  
    // Upload to database
    database.ref().push(newTrain);
  
  
    // Clear text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Firebase event for adding train to database and to table 
  database.ref().on("child_added", function(childSnapshot) {
  
  
    // Store everything into variables
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().trainTime;
    var frequency = childSnapshot.val().frequency;
  

  
    // Time calculations
    var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    moment(currentTime).format("hh:mm");
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var tMinTillTrain = frequency - tRemainder;
    var nextTrain = moment().add(tMinTillTrain, "minutes");

  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text("Every " + frequency + " minutes"),      
      $("<td>").text(moment(nextTrain).format("hh:mm")),
      $("<td>").text(tMinTillTrain)
    );
  
    // Append new row to the table
    $("#train-table > tbody").append(newRow);
  });