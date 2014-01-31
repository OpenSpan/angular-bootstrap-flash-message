angular.module('flash', [])
.factory('flash', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  var messages = {};
  var counter = 1;

  var reset;
  var cleanup = function(zone) {
    $timeout.cancel(reset);
    reset = $timeout(function() { messages[zone] = []; });
  };

  var emit = function() {
    $rootScope.$emit('flash:message', messages, cleanup);
  };

  $rootScope.$on('$locationChangeSuccess', emit);

  pushFlash = function(text, level, seconds, zone) {
    var icon;
    var tagline;
    switch(level) {
      case 'success':
        icon = "icon-ok-circle";
        tagline = 'Success';
        break;
      case 'warning':
        icon = "icon-exclamation-sign";
        tagline = 'Warning';
        break;
      case 'danger':
        icon = "icon-remove";
        tagline = 'Error';
        break;
    }
    messages[zone].push({
      'text': text,
      'level': level,
      'icon': icon,
      'tagline': tagline,
      'seconds': seconds,
      'reference': counter++
    })
    emit();
  };

  var flash = {}
  angular.forEach(['danger', 'warning', 'info', 'success'], function(level) {
    flash[level] = function(options) {
      pushFlash(
        options.text,
        options.level,
        options.seconds || false,
        options.zone
      );
    }
  });

  return flash;
}])

.directive('flashMessages', [function() {
  var directive = { restrict: 'A', replace: true, scope: { "zone": "=" } };
  directive.template =
    '<div ng-repeat="m in messages">' +
      '<div id="flash-message-{{m.reference}}" class="alert alert-{{m.level}}">' +
        '<icon ng-if="m.icon" class="icon-{{ m.icon }}">&nbsp;</icon>'+
        '<strong ng-if="m.tagline">{{ m.tagline }}:&nbsp;</strong>' +
        '{{ m.text }}' +
        '<button type="button" class="close" ng-click="closeFlash(m.reference)" aria-hidden="true">&times;</button>' +
      '</div>' +
    '</div>';

  directive.controller = ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    $scope.closeFlash = function(ref) {
      angular.element("#flash-message-"+ref).remove();
    }
    $rootScope.$on('flash:message', function(_, messages, done) {
      $scope.messages = messages[$scope.zone];
      angular.forEach($scope.messages, function(message) {
        if(message.seconds === false) return;
        $timeout(
          function() { angular.element("#flash-message-"+message.reference).remove(); },
          message.seconds * 1000
        );
      });
      done($scope.zone);
    });
  }];

  return directive;
}]);
