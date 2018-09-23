import React from 'react';
import {Template} from "meteor/templating";
import { ReactiveDict } from 'meteor/reactive-dict';
import './main.html';

import '../imports/startup/accounts-config.js';
import {Notes} from "../imports/api/task";


Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('notes');
});

Template.body.helpers({

    notes(){
      const instance = Template.instance();
   if (instance.state.get('hideCompleted')) {
     return Notes.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
   }
   return Notes.find({}, { sort: { createdAt: -1 } });
 },
 incompleteCount() {
   return Notes.find({ checked: { $ne: true } }).count();
 },

});

Template.hide.events({
  'change .hide-completed input': function(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});

Template.add.events({
  'submit .add-form': function(){
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;

    Meteor.call('notes.insert', text);
    //Clear the form
    target.text.value = '';


    //Close the modal
    $('#addModal').modal('close');


    return false;

  },

});

Template.note.events({
  'click .delete-note': function(){
    // Notes.remove(this._id);
    Meteor.call('notes.remove', this);
    return false;
  },
});

Template.note.events({
  'click .toggle-checked': function() {
   Meteor.call('notes.setChecked', this._id, !this.checked);
   return false;
  },

  'click .toggle-private': function() {
   Meteor.call('notes.setPrivate', this._id, !this.private);
 },

});

Template.note.helpers({

  isOwner() {
     return this.owner === Meteor.userId();
   }

});
