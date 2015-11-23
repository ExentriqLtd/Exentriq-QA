Spaces = new Mongo.Collection("spaces");

/**
 * Spaces schema
 * @type {SimpleSchema}
 */
Spaces.schema = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true
  },
  /**
    Space Id
  */
  id: {
    type: String,
    optional: true
  },
  /**
    Array of posts
  */
  posts: {
    type: [String],
    optional: true
  }
});

/**
 * Attach schema to Spaces collection
 */
Spaces.attachSchema(Spaces.schema);

Spaces.allow({
  insert: function (userId, space) {
    return true;
  }
});
