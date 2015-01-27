'use strict';

function assignValue(obj, objAttr) {
  return function(event) {
    var currentValue = obj[objAttr];
    var newValue = event.currentTarget.value;
    obj[objAttr] = newValue;
    if (obj.onChange && obj.onChange.dispatch) {
      obj.onChange.dispatch(objAttr, newValue, currentValue);
    }
  };
}

function setFocus(element, isInitialized) {
  if (!isInitialized) {
    element.focus();
  }
}

function extend (target, source) {
  target = target || {};
  for (var prop in source) {
    if (source.hasOwnProperty(prop)) {
      target[prop] = source[prop];
    }
  }
  return target;
}

function noop(){}

function addClass(el, className) {
  if (el.attrs.className) {
    el.attrs.className += ' ' + className;
  } else {
    el.attrs.className = className;
  }
}

module.exports = {
  assignValue: assignValue,
  setFocus: setFocus,
  extend: extend,
  addClass: addClass,
  noop: noop
};

