/* eslint-env jest */

const {Resource, StringField} = require('../src/resources');

let fields = [
  StringField('nickname', {required:true}),
  StringField('name', {required:true}),
  StringField('subdomain', {required:true}),
];

test('errors thrown as expected when creating Resource', () => {

  // Null
  expect(() => {
    Resource(null, []);
  }).toThrow(Error);

  // String
  expect(() => {
    Resource('cheese', []);
  }).toThrow(Error);
});


test('no object', () => {
  let r = Resource({}, fields);
  expect(r.to_dict().name).toBe(undefined);
});
