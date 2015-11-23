// Custom Post Fields
Posts.addField({
  fieldName: 'internal',
  fieldSchema: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.addField({
  fieldName: 'spaceId',
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

// Custom User Fields
Users.addField({
  fieldName: 'spaceId',
  fieldSchema: {
    type: String,
    optional: true,
    public: true,
    profile: true
  }
});