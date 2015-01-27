'use strict';

var m = require('mithril');
var util = require('./util');

var extend = util.extend;
var setFocus = util.setFocus;
var noop = util.noop;
var addClass = util.addClass;

function inlineEdit(value, options) {
  options = extend({
    onSave: noop,
    onChange: noop,
    onCancel: noop,
    onStartEdit: noop,
    onNothingDone: noop
  }, options);

  // catch m.prop
  if (typeof value === 'function') {
    options.onChange = value;
    value = value();
  }

  var scope = {
    isEditing: false,
    value: value,
    previousValue: value
  };

  scope.startEdit = function() {
    scope.previousValue = scope.value;
    scope.isEditing = true;
    options.onStartEdit(scope.value);
  };

  scope.save = function() {
    scope.isEditing = false;
    if (scope.previousValue === scope.value) {
      options.onNothingDone(scope.value);
      return;
    }
    scope.previousValue = scope.value;
    options.onSave(scope.value);
  };

  scope.cancel = function() {
    m.startComputation();
    scope.value = scope.previousValue;
    scope.isEditing = false;
    options.onCancel(scope.value);
    m.endComputation();
  };

  scope.setValue = function(event) {
    scope.value = event.target.value;
    options.onChange(scope.value);
  };

  function onKeyPress(event) {
    if (event.keyCode === 27) { // esc
      scope.cancel();
      return false;
    }
    if (event.keyCode === 13) { // enter
      scope.save();
      return false;
    }
  }

  var view = function(els) {
    if (scope.isEditing) {
      els = extend({
        input: m('input'),
        save: m('button', 'save'),
        cancel: m('button', 'cancel')
      }, els);
      els.input.attrs.oninput = scope.setValue;
      els.input.attrs.value = scope.value;
      els.input.attrs.config = setFocus;
      els.input.attrs.onkeyup = onKeyPress;
      els.save.attrs.onclick = scope.save;
      els.cancel.attrs.onclick = scope.cancel;
      return [
        m('.inlineEdit.overlay', {
          onclick: scope.save
        }),
        m('.inlineEdit', [
          els.input,
          els.save,
          els.cancel
        ])
      ];
    }

    els.show = els.show || m('div');
    els.edit = els.edit || m('button', 'edit');
    els.show.attrs.onclick = els.edit.attrs.onclick = scope.startEdit;
    els.show.children = [
      scope.value,
      els.edit
    ];
    addClass(els.show, 'inlineEdit show');
    return [
      els.show,
    ];
  };

  view.__defineSetter__('value', function(value) {
    scope.value = value;
  });

  view.onunload = noop;

  return view;
}

module.exports = inlineEdit;
