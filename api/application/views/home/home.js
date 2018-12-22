lapp.controller('home',['$scope','$routeParams', function($scope,$routeParams){
 $scope.title = 'Parametes';
 $scope.param = $routeParams.theparam; 
}]);