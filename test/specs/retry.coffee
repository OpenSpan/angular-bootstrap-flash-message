"use strict"

describe "Retry", () ->
  
  beforeEach () -> module "flash"

  flash = undefined
  $compile = undefined
  $scope = undefined
  $rootScope = undefined
  $document = undefined

  beforeEach inject (_flash_, _$compile_, _$rootScope_, _$document_) ->
    flash = _flash_
    $compile = _$compile_
    $scope = _$rootScope_.$new()
    $rootScope = _$rootScope_
    $document = _$document_

  it "link should not be rendered", () ->
    template = $compile('<div><flash:messages></flash:messages></div>') $scope

    flash.success
      text: "Test message"

    $scope.$digest()

    templateHtml = template.html()
    expect(templateHtml).not.toContain("Retry")
    

  it "link should be rendered", () ->
    template = $compile('<div><flash:messages></flash:messages></div>') $scope

    flash.success
      text: "Test message"
      retryCallback: () ->

    $scope.$digest()

    templateHtml = template.html()
    expect(templateHtml).toContain("Retry")


  it "should trigger the callback", () ->
    template = $compile('<div><flash:messages></flash:messages></div>') $scope

    testCallback = () -> flash.success { text: "Perfect" }
    flash.success
      text: "Test message"
      retryCallback: testCallback

    $scope.$digest()
    expect(template.html()).toContain("Test message")

    # imagine ng-click to be triggered by use click
    testCallback()
    $scope.$digest()
    expect(template.html()).toContain("Perfect")
