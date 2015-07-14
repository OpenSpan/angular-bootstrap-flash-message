angular.module('flash', [])
.factory('flash', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  var messages = {};
  var counter = 1;

  var reset;
  var cleanup = function(zone) {
    $timeout.cancel(reset);
    reset = $timeout(function() { delete messages[zone]; });
  };

  var emit = function() {
    $rootScope.$emit('flash:message', messages, cleanup);
  };

  $rootScope.$on('$locationChangeSuccess', emit);

  var Message = function Message(text, level, icon, tagline, seconds, retryCallback) {
    this.text = text;
    this.level = level;
    this.icon = icon;
    this.tagline = tagline;
    this.seconds = seconds;
    this.reference = counter++;
    this.retryCallback = retryCallback;
  };

  Message.prototype = {};
  Message.prototype.equals = function(other_message) {
    return typeof other_message !== 'undefined' &&
        other_message !== null &&
        this.text === other_message.text &&
        this.level === other_message.level;
  };
  Message.prototype.foundInCollection = function(array) {
    for (var i in array)
    {
       if (this.equals(array[i])) return true;
    }
    return false;
  };
  Message.prototype.foundInHash = function(hash) {
    //for (var key in hash)
    //{
    //   if (hash.hasOwnProperty(key) && this.equals(hash[key])) return true;
    //}
    var keys = Object.keys(hash);

    for (var i = 0; i < keys.length; i++) {
      if (this.equals(hash[keys[i]])) return true;
    }
    return false;
  };

  pushFlash = function(text, level, seconds, zone, retryCallback) {
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

    messages[zone] = new Message(text, level, icon, tagline, seconds, retryCallback);
    emit();
  };

  var flash = {}
  angular.forEach(['danger', 'warning', 'info', 'success'], function(level) {
    flash[level] = function(options) {
      pushFlash(
        options.text,
        level,
        options.seconds || false,
        options.zone,
        options.retryCallback || false
      );
    }
  });

  return flash;
}])

.directive('flashMessages', [function() {
  var directive = { restrict: 'EA', replace: true, scope: { "zone": "@" } };
  directive.template =
    '<div ng-repeat="m in messages" id="flash-message-{{m.reference}}" class="alert alert-{{m.level}}">' +
      '<icon ng-if="m.icon" class="icon-{{ m.icon }}">&nbsp;</icon>'+
      '<strong ng-if="m.tagline">{{ m.tagline }}:&nbsp;</strong>' +
      '{{ m.text }} ' +
      '<a ng-if="m.retryCallback" href="javascript:void(0);" ng-click="m.retryCallback">Retry</a>' +
      '<button type="button" class="close" ng-click="closeFlash(m.reference)" aria-hidden="true">&times;</button>' +
    '</div>';
  directive.controller = ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    $scope.messages = {};
    $scope.closeFlash = function(ref) {
      delete $scope.messages[ref];
    }
    $rootScope.$on('flash:message', function(_, messages, done) {
      if(messages[$scope.zone]) {
        message = messages[$scope.zone];
        // Ignore message if an equalivalent message is already shown
        if (!message.foundInHash($scope.messages)) {
          $scope.messages[message.reference] = message;
          if(message.seconds) {
            var localReference = message.reference;
            $timeout(
              function() { $scope.closeFlash(localReference); },
              message.seconds * 1000
            );
          }
          done($scope.zone);
        }
      }
    });
  }];

  return directive;
}]);
