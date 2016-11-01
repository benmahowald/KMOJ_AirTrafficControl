// Initialize Firebase
var config = {
    apiKey: "AIzaSyCfDosHsBK9V7lMiHnTL20AShSp9RNoqm4",
    authDomain: "kmoj-9b0b1.firebaseapp.com",
    databaseURL: "https://kmoj-9b0b1.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "486458567756"
  };
  
  var mainApp = firebase.initializeApp(config);
  var secondaryApp = firebase.initializeApp(config, "Secondary");
