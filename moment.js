/*
1. Connect to DB
2. Get default data
+> display data to user
3. Capture submit button click
4. Send to database
5. Display destination to user
*/

$(document).ready(function() {
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
    var currentKey = "";
    var minCompare = 0;

    // Set inital state (disable)
    $("#select-newData").attr("disabled", "disabled");
    $("#select-delData").attr("disabled", "disabled");

    // When data in TrainSchedule is changed
    database.ref("/TrainSchedule").on("value", function(snap) {
        // Clear table
        $("#display-schedule").empty();

        // Get current data
        $("#curtime").text("(Current Time " + moment().format("hh:mm A") + ")");

        // Add data to table
        snap.forEach(function(childsnap) {
            if(childsnap.key !== "timeCounter") {
                var info = childsnap.val();

                var tr = $("<tr>");
                tr.attr("key", childsnap.key);
                tr.append("<td>" + info.trainName + "</td>");
                tr.append("<td>" + info.destination + "</td>");
                tr.append("<td>" + info.frequency + "</td>");

                // Calculate time using moment.js
                var firstTimeConverted = moment(info.firstTime, "hh:mm").subtract(1, "years");
                var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
                var tRemainder = diffTime % info.frequency;
                var tMinutesTillTrain = info.frequency - tRemainder;
                var nextTrain = moment().add(tMinutesTillTrain, "minutes");

                tr.append("<td>" + moment(nextTrain).format("hh:mm A") + "</td>");
                tr.append("<td>" + tMinutesTillTrain + "</td>");
                
                $("#display-schedule").append(tr);
            }
        });
    });

    // When "Submit" button is clicked
    $("#select-addData").on("click", function(event) {
        // prevent form from submitting
        event.preventDefault();

        // Retrieve data
        var name = $("#data-name").val().trim();
        var dest = $("#data-dest").val().trim();
        var ftime = $("#data-ftime").val().trim();
        var freq = $("#data-freq").val().trim();

        // Check if all data isn't empty
        if((name !== "") && (dest !== "") && (ftime !== "") && (freq !== "")) {

            if(currentKey === "") {
                // Add new data to Firebase
                database.ref("/TrainSchedule").push({
                    trainName: name,
                    destination: dest,
                    firstTime: ftime,
                    frequency: freq
                });
            }
            else {
                // Update data
                database.ref("/TrainSchedule/" + currentKey).set({
                    trainName: name,
                    destination: dest,
                    firstTime: ftime,
                    frequency: freq
                });				
            }

            // Clear each field
            $("#data-name").val("");
            $("#data-dest").val("");
            $("#data-ftime").val("");
            $("#data-freq").val("");

            // Disable "New" and "Delete" buttons
            $("#select-newData").attr("disabled", "disabled");
            $("#select-delData").attr("disabled", "disabled");
        }
        else {
            alert("All inputs are required!");
        }
    });

    // When a row in table is clicked
    $(document).on("click", "tbody tr", function() {
        // Display data of selected row
        currentKey = $(this).attr("key");

        database.ref("/TrainSchedule/" + currentKey).on("value", function(snap) {
            $("#data-name").val(snap.val().trainName);
            $("#data-dest").val(snap.val().destination);
            $("#data-ftime").val(snap.val().firstTime);
            $("#data-freq").val(snap.val().frequency);
        });

        // Enable "New" and "Delete" buttons
        $("#select-newData").removeAttr("disabled");
        $("#select-delData").removeAttr("disabled");
    });

    // When "New" button is clicked
    $("#select-newData").on("click", function(event) {
        // prevent form from submitting
        event.preventDefault();

        // Initialize currentKey
        currentKey = "";

        // Clear each field
        $("#data-name").val("");
        $("#data-dest").val("");
        $("#data-ftime").val("");
        $("#data-freq").val("");

        // Disable "New" and "Delete" buttons
        $("#select-newData").attr("disabled", "disabled");
        $("#select-delData").attr("disabled", "disabled");		
    });

    // When "Delete" button is clicked
    $("#select-delData").on("click", function(event) {
        // prevent form from submitting
        event.preventDefault();

        // Delete selected data
        database.ref("/TrainSchedule").child(currentKey).remove();

        // Initialize currentKey
        currentKey = "";

        // Clear each field
        $("#data-name").val("");
        $("#data-dest").val("");
        $("#data-ftime").val("");
        $("#data-freq").val("");

    });

    // Set timer
    var intervalId = setInterval(function() {
        var minute = moment().minute();
        if(minute !== minCompare) {
            minCompare = minute;
            database.ref("/TrainSchedule/timeCounter").set(minCompare);
        }
    }, 1000);	

    });
