var app = angular.module('App', ['ngRoute', 'firebase', 'ngMaterial']);

app.controller('authController', function($scope, $firebaseArray, $firebaseAuth, $http) {
  var auth = $firebaseAuth();
  console.log('in authController');

  //User login
  $scope.logIn = function(){
    console.log('in logIn()');
    auth.$signInWithEmailAndPassword($scope.userEmail, $scope.userPassword).then(function(firebaseUser) {
      console.log("Authentication Success!");
      $scope.loggedIn = true;
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
          url: '/auth/adminLogin',
          headers: {
            id_token: idToken
          }//end header object
        }).then(function(response){
          $scope.signedIn = response.data;
          //clear login input fields
          $scope.userEmail = "";
          $scope.userPassord="";
        });//end response
      });//end return idToken
    }//end if(firebaseUser)
    else{
      console.log('Not logged in.');
      $scope.signedIn = "Please login"
    }//end else
  });//end onAuthStateChanged()

  //User logout
  $scope.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
      $scope.loggedIn = false;
    });//end signOut
  };//end logOut
});//end authController

app.controller('mainController', function($scope, $http) {
  $scope.linkList =[
    {route:'admin',text:'Admin', permission:''},
    {route:'dashboard',text:'Dashboard', permission:''},
    {route:'production',text:'Production', permission:''},
    {route:'report',text:'Report', permission:''},
    {route:'traffic',text:'Traffic', permission:''},
    {route:'underwriter',text:'Underwriter', permission:''}
  ];
});

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
