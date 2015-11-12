// Global API configuration
var Api = new Restivus({
  prettyJson: true,
  apiPath: 'custom-api'
});

/****** Users   ******/
Api.addRoute('users/createUser', {authRequired: false}, {
  post: function() {
    try {
      var platformUsername = this.bodyParams.username;
      var platformEmail = this.bodyParams.email;
      Meteor.call('registerPlatformUser', platformUsername, platformEmail, function (err, result) {
      });

      return {
        status: 'success'
      };
    }
    catch(e) {
      return {
        statusCode: 400,
        body: {status: 'fails', message: e.name + '::' + e.message}
      };
    }
  }
});

/****** Posts ******/
Api.addCollection(Posts);

