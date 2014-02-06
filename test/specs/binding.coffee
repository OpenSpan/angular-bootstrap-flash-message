"use strict"

describe "Binding", () ->

  beforeEach () -> module "flash"

  flash = undefined
  $compile = undefined
  $scope = undefined
  $rootScope = undefined

  beforeEach inject (_flash_, _$compile_, _$rootScope_) ->
    flash = _flash_
    $compile = _$compile_
    $scope = _$rootScope_.$new()
    $rootScope = _$rootScope_


  it "should render message", () ->
    template = $compile('<div flash:messages></div>') $scope
    flash.success
      text: "Test message"
    $scope.$digest()

    templateHtml = template.html()
    expect(templateHtml).toContain("Test message")
 

  it "should render zone specific messages", () ->
    template = $compile('<div flash:messages zone="main"></div>') $scope
    flash.success
      text: "Test message"
      zone: "main"
    $scope.$digest()

    templateHtml = template.html()
    expect(templateHtml).toContain("Test message")

  it "should not leak zones", () ->
    template = $compile('<div flash:messages zone="main"></div>') $scope
    flash.success
      text: "Intended"
      zone: "main"

    flash.success
      text: "Unintended"

    $scope.$digest()

    templateHtml = template.html()
    expect(templateHtml).not.toContain("Unintended")
