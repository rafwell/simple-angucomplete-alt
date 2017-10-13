angular.module('app', ['angucomplete-alt']).directive('simpleAngucomplete', function() {
    return {
        restrict: 'E',
        require: 'ngModel',
        templateUrl: 'bower_components/simple-angucomplete-alt/simple-angucomplete-alt.template.html',
        scope: {
            ngModel: '='
        },
        replace: true,
        controller: function($scope, $element, $http, $timeout) {              
            $scope.selectedObject = function(selected) {                          
                if (selected) {
                    $scope.ngModel = selected.originalObject.id;
                }else{
                    $scope.ngModel = null;                    
                }
            };    

            $scope.clearIfNotSelected = function(){
                $timeout(function(){
                    if(!$scope.ngModel)
                        $scope.$broadcast('angucomplete-alt:clearInput', $scope.id);                    
                }, 300);                
            };

            $scope.getInitialValue = function(){
                if($scope.ngModel){
                    $http({
                        url: $element.find('.angucomplete-alt').attr('remote-url')+'&id='+$scope.ngModel
                    }).then(function(response){                        
                        $scope.initialValue = response.data[ $element.find('.angucomplete-alt').attr('title-field') ];
                    });
                }
            };

            $scope.getInitialValue();
        },
        link: function(scope, element, attrs) {
            scope.placeholder = attrs.placeholder;
            scope.remoteUrl = attrs.remoteUrl;            
            scope.titleField = attrs.titleField;
            scope.descriptionField = attrs.descriptionField;
            scope.minlength = attrs.minlength ? attrs.minlength : 2;
            scope.id = 'autocomplete_'+attrs.ngModel;                
            angular.element('body').on('change', '#'+scope.id+'_value',  function(){
                scope.clearIfNotSelected();
            });      
        }
    };
});