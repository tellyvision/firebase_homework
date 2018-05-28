/*
1. Connect to DB
2. Get default data
+> display data to user
3. Capture submit button click
4. Send to database
5. Display destination to user
*/



//initialize database
var config = {
    apiKey: "AIzaSyCBe91PBY0nqs0SDv6M1TXKWd7iI6ANsNQ",
    authDomain: "trainapp-399d7.firebaseapp.com",
    databaseURL: "https://trainapp-399d7.firebaseio.com",
    projectId: "trainapp-399d7",
    storageBucket: "trainapp-399d7.appspot.com",
    messagingSenderId: "655657777863"
  };

firebase.initializeApp(config);
var database = firebase.database();

var trainList = $("#trainList")

//database.ref().on("value", function(snapshot) {

//console.log(snapshot.val());

//below is string interpolating
//not jQuery, pure JS
//console.log(`${snapshot.val().trainName}: ${snapshot.val().destination}`)


//var storeCurrentVal = trainList
//var storeCurrentValue = trainList.val()

//trainList.text(storeCurrentValue + `${snapshot.val().trainName}: ${snapshot.val().destination}`)

//})


database.ref().on("child_added", function(childsnapshot) {
    var previousText = trainList.html()

    // \n creates a new line
    trainList.html(`${previousText}\n <tr><th>${childsnapshot.val().trainName}</th><th>${childsnapshot.val().destination}</th><th>${childsnapshot.val().firstTrain}</th><th>${childsnapshot.val().freq}</tr>`)

    //below makes the textarea automatically scrol to bottom
    trainList.scrollTop(trainList[0].scrollHeight)

})

$("#submitTrain").on("click", function(event) {
    event.preventDefault();
    console.log(this)

    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var freq = $("#freq").val().trim();
    console.log(trainName)
    console.log(destination)

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        freq: freq,
    })

    $("#trainName").val("")
    $("#destination").val("")
    $("#firstTrain").val("")
    $("#freq").val("")

})
