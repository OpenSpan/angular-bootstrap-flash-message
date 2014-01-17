angular.module('flash', [])
.factory('flash', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  var messages = [];
  var counter = 1;

  var reset;
  var cleanup = function() {
    $timeout.cancel(reset);
    reset = $timeout(function() { messages = []; });
  };

  var emit = function() {
    $rootScope.$emit('flash:message', messages, cleanup);
  };

  $rootScope.$on('$locationChangeSuccess', emit);

  pushFlash = function(text, level, seconds) {
    messages.push({
      'text': text,
      'level': level,
      'seconds': seconds,
      'reference': counter++
    })
    emit();
  };

  var flash = {}
  angular.forEach(['danger', 'warning', 'info', 'success'], function(level) {
    flash[level] = function (text, seconds) { pushFlash(text, level, seconds || false); };
  });

  return flash;
}])

.directive('flashMessages', [function() {
  var directive = { restrict: 'A', replace: true };
  directive.template =
    '<div ng-repeat="m in messages">' +
      '<div id="flash-message-{{m.reference}}" class="alert alert-{{m.level}} alert-dismissable">' +
        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
        '{{m.text}}' +
      '</div>' +
    '</div>';

  directive.controller = ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    $rootScope.$on('flash:message', function(_, messages, done) {
      $scope.messages = messages;
      angular.forEach(messages, function(message) {
        if(message.seconds === false) return;
        $timeout(
          function() { angular.element("#flash-message-"+message.reference).remove(); },
          message.seconds * 1000
        );
      });
      done();
    });
  }];

  return directive;
}]);
