"use strict"

describe "Setter", () ->

  beforeEach () -> module "flash"

  flash = undefined
  $rootScope = undefined
  emittedStructure = undefined

  beforeEach inject (_$rootScope_, _flash_) ->
    $rootScope = _$rootScope_
    flash = _flash_
    emittedStructure = jasmine.createSpy "emittedStructure"
    spyOn($rootScope, '$emit').andCallFake (_, structure, __) ->
      emittedStructure structure


  it "should exist for danger, succes, info, warning", () ->
    expect(flash.danger).not.toEqual(undefined)
    expect(flash.success).not.toEqual(undefined)
    expect(flash.info).not.toEqual(undefined)
    expect(flash.warning).not.toEqual(undefined)

  it "of all levels should trigger an emit call", () ->
    flash.danger
      text: "test"
    expect($rootScope.$emit.callCount).toEqual(1)
    flash.success
      text: "test"
    expect($rootScope.$emit.callCount).toEqual(2)
    flash.warning
      text: "test"
    expect($rootScope.$emit.callCount).toEqual(3)
    flash.info
      text: "test"
    expect($rootScope.$emit.callCount).toEqual(4)

  it "should trigger emit with extended structure", () ->
    flash.success
      text: "Test"

    expectedEmit =
      text: "Test",
      level: "success",
      icon: "icon-ok-circle",
      tagline: "Success",
      seconds: false,
      reference: 1
      retryCallback: false

    expect(emittedStructure).toHaveBeenCalledWith { undefined: expectedEmit }
