import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { check } from 'meteor/check';

export const Notes = new Mongo.Collection('notes');



Meteor.methods ({
  'notes.insert'(text){
    check(text, String);

    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    Notes.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'notes.remove'(note){
    check(note._id, String);
    if(note.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    Notes.remove(note._id);
  },
  'notes.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const note = Notes.findOne(taskId);
    if (note.private &&note.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Notes.update(taskId, { $set: { checked: setChecked } });
  },
  'notes.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const note = Notes.findOne(taskId);
    if (note.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Notes.update(taskId, { $set: { private: setToPrivate } });
  },
});
