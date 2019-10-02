import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  artist: DS.attr('string'),
  language: DS.attr('string'),
  year: DS.attr('string'),
  duration: DS.attr('number'),
});
