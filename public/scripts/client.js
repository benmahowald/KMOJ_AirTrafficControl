var app = angular.module('App', ['ngRoute', 'firebase']);

app.controller('authController', function($scope, $firebaseArray, $firebaseAuth, $http) {
  var auth = $firebaseAuth();
  console.log('in authController');

//current logged in user data from database
$scope.userData;

  //User login
  $scope.logIn = function(){
    console.log('in logIn()');
    auth.$signInWithEmailAndPassword($scope.userEmail, $scope.userPassword).then(function(firebaseUser) {
      console.log("Authentication Success!");
      $scope.loggedIn = true;
      console.log("return from DB after login. FirebaseUser=",firebaseUser);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });//end catch error
  };//end logIn()

  //Authentication state change
  auth.$onAuthStateChanged(function(firebaseUser){
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/auth/Login',
          headers: {
            id_token: idToken
          }//end header object
        }).then(function(response){
          $scope.userData = response.data;
          console.log('user permission is', $scope.userData[0].permission);
          //clear login input fields
          $scope.userEmail = "";
          $scope.userPassword="";
        });//end response
      });//end return idToken
    }//end if(firebaseUser)
    else{
      console.log('Not logged in.');
      $scope.signedIn = "Please login"
    }//end else
  });//end onAuthStateChanged()

//loads userData on page load
$scope.init = function (){
  if(firebaseUser) {
    firebaseUser.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/auth/Login',
        headers: {
          id_token: idToken
        }//end header object
      }).then(function(response){
        $scope.userData = response.data;
        console.log('user permission is', $scope.userData[0].permission);
        //clear login input fields
        $scope.userEmail = "";
        $scope.userPassword="";
      });//end response
    });//end return idToken
  }//end if(firebaseUser)
  else{
    console.log('Not logged in.');
    $scope.signedIn = "Please login"
  }//end else
};



  //User logout
  $scope.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
      $scope.loggedIn = false;
    });//end signOut
  };//end logOut


  $scope.linkList =[
    {route:'admin', linkText:'Admin', permission:'Administration'},
    {route:'dashboard', linkText:'Dashboard', permission:''},
    {route:'production', linkText:'Production', permission:'Production'},
    {route:'report', linkText:'Report', permission:''},
    {route:'traffic', linkText:'Traffic', permission:'Traffic'},
    {route:'underwriter', linkText:'Underwriter', permission:'Underwriter'}
  ];//end scope.linkList

});//end authController

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  // console.log('$routeProvider:',$routeProvider);

  $routeProvider.
  when('/dashboard', {
    templateUrl: '/views/partials/dashView.html',
    controller: 'dashController'
  }).
  when('/admin', {
    templateUrl: '/views/partials/adminView.html',
    controller: 'adminController'
  }).
  when('/production', {
    templateUrl: '/views/partials/prodView.html',
    controller: 'prodController'
  }).
  when('/report', {
    templateUrl: '/views/partials/reportView.html',
    controller: 'reportController'
  }).
  when('/search', {
    templateUrl: '/views/partials/searchView.html',
    controller: 'searchController'
  }).
  when('/traffic', {
    templateUrl: '/views/partials/trafficView.html',
    controller: 'trafficController'
  }).
  when('/underwriter', {
    templateUrl: '/views/partials/uwView.html',
    controller: 'uwController'
  }).
  otherwise({
    redirectTo: '/dashboard'
  });

  // use the HTML5 History API for pretty URLs
  $locationProvider.html5Mode(true);
}]);// end NG-routing

// navbar collapse on click of anchor
$(document).on('click','.navbar-collapse.in',function(e) {
  if( $(e.target).is('a') ) {
    $(this).collapse('hide');
  } // end if statement
}); // end document ready
