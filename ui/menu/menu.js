laapp.controller('menu',['$scope','$routeParams', function($scope,$routeParams){
 $scope.title = 'Parametes';
 $scope.param = $routeParams.theparam; 
 $scope.test = 'okeeee';
 console.log('berhasil');
}]);