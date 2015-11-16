// Global API configuration
var Api = new Restivus({
  prettyJson: true,
  apiPath: 'custom-api'
});

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

// Posts collection routes
Api.addRoute('posts/', {authRequired: false}, {
  get: function(){
    return {
      status: "success",
      data: Posts.find({}).fetch()
    }
  },
  post: function(){
    var id = Posts.insert(this.bodyParams);
    return {
      status: "success",
      data: {
        _id: id
      }
    }
  }
});

Api.addRoute('posts/:id', {authRequired: false}, {
  patch: function () {
    // remove all comments for this post
    // This call will then reinsert all the commments 
    var comments = _.pluck(Comments.find({postId: this.urlParams.id}).fetch(), '_id');
    _.each(comments, function(element, index){
      Comments.remove(element);
    });
    Posts.update(this.urlParams.id, {
      $set: this.bodyParams
    });
    return {
      status: "success",
      data: {
        _id: this.urlParams.id
      }
    }
  }
});

Api.addCollection(Comments);