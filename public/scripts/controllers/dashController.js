app.controller('dashController', ['$scope', function($scope){
  console.log('Dashboard Controller');

  // navbar collapse on click of anchor
  $(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    } // end if statement
}); // end document ready
}]); // end dashController
