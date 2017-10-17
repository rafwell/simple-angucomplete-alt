angular.module('app').directive('simpleAngucomplete', function($compile) {
    return {
        restrict: 'E',  
        scope: {
          ngModel: '=',
          ngChange: '&'
        },      
        templateUrl: 'bower_components/simple-angucomplete-alt/simple-angucomplete-alt.template.html',        
        replace: true,        
        require: 'ngModel',        
        controller: function($scope, $element, $http, $timeout, $compile) {
            $scope.lastestNgModel = null;

            $scope.$watch('ngModel', function(newValue){
                if(newValue!=$scope.lastestNgModel)                 
                    $scope.getInitialValue();         
            }, true);

            $scope.selectedObject = function(selected) {                          
                if (selected) {
                    $scope.ngModel = selected.originalObject.id;                    
                }else{
                    $scope.ngModel = null;                    
                }

                if($scope.lastestNgModel != $scope.ngModel){
                    $scope.lastestNgModel = angular.copy($scope.ngModel);
                    if($scope.ngChange){
                        if($scope.timeoutChange)
                            $timeout.cancel($scope.timeoutChange);
                            
                        $scope.timeoutChange = $timeout($scope.ngChange, 300);
                    }
                }
            };    

            $scope.clearIfNotSelected = function(){
                if($scope.timeoutClear)
                    $timeout.cancel($scope.timeoutClear);

                $scope.timeoutClear = $timeout(function(){
                    if(!$scope.ngModel)
                        $scope.$broadcast('angucomplete-alt:clearInput', $scope.id);                    
                }, 300);                
            };

            $scope.getInitialValue = function(){                 
                if($scope.ngModel){
                    $http({
                        url: $scope.remoteUrl+'&id='+$scope.ngModel
                    }).then(function(response){ 
                        if(response.data[ $scope.titleField ])
                            $scope.$broadcast('angucomplete-alt:changeInput', $scope.id, response.data[ $scope.titleField ]);
                        else
                            $scope.$broadcast('angucomplete-alt:clearInput', $scope.id);                    

                    }).catch(function(err){
                        console.log(err);                        
                    });
                }else{
                    $scope.$broadcast('angucomplete-alt:clearInput', $scope.id);                    
                }
            };    
        },
        link: function($scope, element, attrs, ctrl) {  
            ctrl.$viewChangeListeners.push(function() {
              scope.$eval(attr.ngChange);
            });          

            $scope.placeholder = attrs.placeholder;
            $scope.remoteUrl = attrs.remoteUrl;            
            $scope.titleField = attrs.titleField;
            $scope.descriptionField = attrs.descriptionField;                        
            $scope.minlength = attrs.minlength ? attrs.minlength : 2;
            $scope.id = 'autocomplete_'+attrs.ngModel.substr('.', '_');                         
            angular.element('body').on('change', '#'+$scope.id+'_value',  function(){                
                $scope.clearIfNotSelected();
            });
        }
    };
});