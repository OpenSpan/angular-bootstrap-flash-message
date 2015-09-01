# Angular Bootstrap flash message

A fork from the `angular-flash` project, with two aims; to have the flash messages use the 
Bootstrap styling and have the option to timeout messages.

# Installation

`bower install angular-bootstrap-flash-message`

# Usage

```js
angular.controller("Test", [
 '$scope',
 'flash',
 function($scope, flash) {
   flash.success({
     text: "Success message",
     seconds: 10,
     zone: 'form',
     retryCallback: function() { doSomething(); }
     clearPrior: true
   });
 }]);
```

The module exports the `flash` service with the following methods:

 * `flash.success`
 * `flash.danger`
 * `flash.warning`
 * `flash.info`
   * Info does not have a icon or tagline.

Each of these methods take arguments:
 
 * the flash message
 * (optional) timeout to delete the flash message, in seconds
 * (optional) matching zone to display the message (defaults to unspecified zone)
 * (optional) retry callback
 * (optional) clear existing messages on the matching zone before adding this one

And in order to render the flash messages, you must add the following directive in your
template:

```html
<flash:messages></flash:messages>
```

This defaults to an unspecified zone.

You can also specify a zone to have multiple locations of messages, relating to your controls:

```html
<flash:messages zone="myForm"></flash:messages>
```
