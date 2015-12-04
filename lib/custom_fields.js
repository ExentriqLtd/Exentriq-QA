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

Posts.removeField('url');

Posts.addField({
  fieldName: 'backToMyRoots',
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

// Exentriq users don't have to complete profile email to access the app
Users.removeField('telescope.email');
Users.addField({
  fieldName: 'telescope.email',
  fieldSchema: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
    editableBy: ["member", "admin"]
  }
});