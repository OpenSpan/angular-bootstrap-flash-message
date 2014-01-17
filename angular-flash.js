angular.module('flash', [])
.factory('flash', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  var messages = [];

  var reset;
  var cleanup = function() {
    $timeout.cancel(reset);
    reset = $timeout(function() { messages = []; });
  };

  var emit = function() {
    $rootScope.$emit('flash:message', messages, cleanup);
  };

  $rootScope.$on('$locationChangeSuccess', emit);

  var flash = function(text, level) {
    messages.push([ 'text': text, 'level': level || 'success' ])
    emit();
  };

  angular.forEach(['danger', 'warning', 'info', 'success'], function(level) {
    flash[level] = function (text) { flash(text, level); };
  });

  return flash;
}])

.directive('flashMessages', [function() {
  var directive = { restrict: 'A', replace: true };
  directive.template =
    '<div ng-repeat="m in messages" class="alert alert-{{m.level}} alert-dismissable">' +
      '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
      '{{m.text}}' +
    '</li>';

  directive.controller = ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.$on('flash:message', function(_, messages, done) {
      $scope.messages = messages;
      done();
    });
  }];

  return directive;
}]);
