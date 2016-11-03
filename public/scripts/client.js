var app = angular.module('App', ['ngRoute', 'firebase', 'ngMaterial', 'xeditable']);

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
      $scope.signedIn = "Please login";
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
    {route:'admin', linkText:'Admin', permission:'View All'},
    {route:'admin/employees', linkText:'Employee Authorization', permission:'Administration'},
    {route:'admin/employees', linkText:'Employee Authorization', permission:'View All'},
    {route:'admin/report', linkText:'Report', permission:'Administration'},
    {route:'admin/report', linkText:'Report', permission:'View All'},
    {route:'production', linkText:'Production', permission:'Production'},
    {route:'production', linkText:'Production', permission:'View All'},
    {route:'traffic', linkText:'Traffic', permission:'Traffic'},
    {route:'traffic', linkText:'Traffic', permission:'View All'},
    {route:'underwriter', linkText:'Underwriter', permission:'Underwriter'},
    {route:'underwriter', linkText:'Underwriter', permission:'View All'},
    {route:'underwriter/createClient', linkText:'Create Client', permission:'Underwriter'},
    {route:'underwriter/createClient', linkText:'Create Client', permission:'View All'},
    {route:'underwriter/editClient', linkText:'Edit Client', permission:'Underwriter'},
    {route:'underwriter/editClient', linkText:'Edit Client', permission:'View All'},
    {route:'underwriter/aired', linkText:'Aired History', permission:'Underwriter'},
    {route:'underwriter/aired', linkText:'Aired History', permission:'View All'}
  ];//end scope.linkList

});//end authController

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

  $routeProvider.
  when('/admin', {
    templateUrl: '/views/partials/adminView.html',
    controller: 'adminController'
  }).
  when('/admin/employees', {
    templateUrl: '/views/partials/adminAuthorizationView.html',
    controller: 'adminController'
  }).
  when('/admin/report', {
    templateUrl: '/views/partials/reportView.html',
    controller: 'reportController'
  }).
  when('/production', {
    templateUrl: '/views/partials/prodView.html',
    controller: 'prodController'
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
  when('/underwriter/createClient', {
    templateUrl: '/views/partials/dashView.html',
    controller: 'dashController'
  }).
  when('/underwriter/editClient', {
    templateUrl: '/views/partials/uwEditClientView.html',
    controller: 'uwController'
  }).
  when('/underwriter/aired', {
    templateUrl: '/views/partials/uwAiredView.html',
    controller: 'uwController'
  }).
  when('/viewall', {
    templateUrl: '/views/partials/index.html'
  }).
  otherwise({
    redirectTo: '/views/partials/index.html'
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
