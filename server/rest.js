// Global API configuration
var Api = new Restivus({
  prettyJson: true,
  apiPath: 'custom-api'
});

Api.addCollection(Posts);
Api.addCollection(Comments);

