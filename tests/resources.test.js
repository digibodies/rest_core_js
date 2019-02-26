/* eslint-env jest */
const models = require('core').models;
const {Resource, StringField, IntegerField, DateTimeField, FloatField, BooleanField} = require('../src/resources');

// Example for Core model interface
let Organization = models.model('Organization', {
  name: models.StringProperty({default:'unknown'}),
  nickname: models.StringProperty(),
  subdomain: models.StringProperty(),
  date: models.DateTimeProperty(),
  float: models.FloatProperty(),
  int: models.IntegerProperty(),
  bool: models.BooleanProperty(),
});

// Example resource schema
let fields = [
  StringField('nickname', {required:true}),
  StringField('name', {required:true}),
  StringField('subdomain', {required:true}),
  DateTimeField('date', {required: true}),
  FloatField('float', {required: true}),
  IntegerField('int', {required: true}),
  BooleanField('bool', {required:true})
];


describe('Resource creation', () => {
  test('should throw when input obj is null', () => {
    // Null
    expect(() => {
      Resource(null, []);
    }).toThrow(Error);
  });

  test('should throw when input obj is unexpected type', () => {
    expect(() => {
      Resource('cheese', []);
    }).toThrow(Error);
  });

  test('should return empty object when given empty object', () => {
    let r = Resource({}, fields);
    expect(r.to_dict().name).toBe(undefined);
  });
});



describe('Converting a Resource to_dict should', () => {
  test('should succeed with core model', () => {
    let o = Organization();
    o.name = 'Council of Ricks';
    o.subdomain = 'ricks';
    o.nickname = 'The Ricks';
    o.date = new Date();
    o.float = 1.5;
    o.int = 22;
    o.bool = true;

    let r = Resource(o, fields).to_dict();
    expect(r._meta.resource_type).toBe('Organization');
    expect(r.name).toBe('Council of Ricks');
    expect(r.subdomain).toBe('ricks');
    expect(r.nickname).toBe('The Ricks');
  });

  test('should succeed with core model and explicit ResourceType', () => {
    let o = Organization();
    o.name = 'Council of Ricks';
    o.subdomain = 'ricks';
    o.nickname = 'The Ricks';
    o.date = new Date();
    o.float = 1.5;
    o.int = 22;
    o.bool = true;

    let r = Resource(o, fields, 'OrganizationV1').to_dict();
    expect(r._meta.resource_type).toBe('OrganizationV1');
    expect(r.name).toBe('Council of Ricks');
    expect(r.subdomain).toBe('ricks');
    expect(r.nickname).toBe('The Ricks');
  });

  test('should succeed with ad hoc object and no ResourceType', () => {
    let o = {
      'name': 'Council of Ricks',
      'subdomain': 'ricks',
      'nickname': 'The Ricks',
      'date': new Date(),
      'float': 1.5,
      'int': 22,
      'bool': true,
    };

    let r = Resource(o, fields).to_dict();
    expect(r._meta.resource_type).toBe('UNDEFINED_KIND');
    expect(r.name).toBe('Council of Ricks');
    expect(r.subdomain).toBe('ricks');
    expect(r.nickname).toBe('The Ricks');
    expect(r.date).toBeInstanceOf(Date);
    expect(r.float).toBe(1.5);
    expect(r.int).toBe(22);
    expect(r.bool).toBe(true);
  });

  test('should succeed with ad hoc object and explicit ResourceType', () => {
    let o = {
      'name': 'Council of Ricks',
      'subdomain': 'ricks',
      'nickname': 'The Ricks',
      'date': new Date(),
      'float': 1.5,
      'int': 22,
      'bool': true,
    };

    let r = Resource(o, fields, 'OrganizationV1').to_dict();
    expect(r._meta.resource_type).toBe('OrganizationV1');
    expect(r.name).toBe('Council of Ricks');
    expect(r.subdomain).toBe('ricks');
    expect(r.nickname).toBe('The Ricks');
    expect(r.date).toBeInstanceOf(Date);
    expect(r.float).toBe(1.5);
    expect(r.int).toBe(22);
    expect(r.bool).toBe(true);
  });
});
