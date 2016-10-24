var app = angular.module("App", ["firebase"]);
app.controller("authController", function($scope, $firebaseArray, $firebaseAuth, $http) {
  var auth = $firebaseAuth();

  //Login
  $scope.logIn = function login(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Signed in as:", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed:", error);
    });//end error
  };//end logIn

  //runs whenever the user changes authentication states
  auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/adminLogin',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          $scope.signedIn = response.data;
        });//end response
      });//end getToken
    }//end if
    else {
      console.log('Not logged in.');
      $scope.signedIn = "Please Login";
    }//end else
  });//end onAuthStateChanged

  //Logout
  $scope.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logged out');
    });//end response
  };//end logOut
});//end authController
