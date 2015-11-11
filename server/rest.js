// Global API configuration
var Api = new Restivus({
  prettyJson: true,
  apiPath: 'custom-api'
});

Api.addCollection(Posts);
Api.addCollection(Comments);


// Maps to: /custom-api/users/:name
  Api.addRoute('users/:name', {authRequired: false}, {
    get: function () {
    	const user = Users.findOne({'profile.name':this.urlParams.name });
    	if(user)
	      return {
	      	_id: user._id,
	      	username: user.username,
	      	profile: user.profile
	      }
	    else
	    	return 'error: user not found';
    }
  });
