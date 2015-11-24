// Global API configuration
var Api = new Restivus({
  prettyJson: true,
  apiPath: 'custom-api'
});

/**
 * @api {get} /user/:name Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} name Users unique Name.
 *
 * @apiSuccess {String} _id ID of the User.
 * @apiSuccess {String} username  Username of the User.
 * @apiSuccess {Object} profile  Profile of the User.
 *
 * @apiError UserNotFound The name of the User was not found.
 */
Api.addRoute('user/:name', {authRequired: false}, {
  get: function () {
  	const user = Users.findOne({'profile.name':this.urlParams.name });
  	if(user)
      return {
      	_id: user._id,
      	username: user.username,
      	profile: user.profile
      }
    else
    	return {
        error: 'User not found' 
      };
  }
});

/**
 * @api {get} /posts Request posts collection
 * @apiName GetPosts
 * @apiGroup Post
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

/**
 * @api {post} /posts Create new post
 * @apiName CreatePost
 * @apiGroup Post
 * 
 * @apiParam {String} title Title of the Post.
 * @apiParam {String} [body] Body of the Post.
 * @apiParam {Number} status Status of the Post (1 - 2 - 3).
 * @apiParam {Boolean} [internal] Type of the Post. Public or Internal.
 * @apiParam {String} [spaceId] Space in which the post is goin to be inserted.
 *
 * @apiSuccess {String} _id ID of the post.
 */
Api.addRoute('posts', {authRequired: false}, {
  get: function(){
    return {
      status: "success",
      data: Posts.find({}, {fields: {
        'sticky': 0,
        'postedAt': 0,
        'slug': 0,
        'htmlBody': 0 }
      }).fetch()
    }
  },
  post: function(){
    var spaceId = this.bodyParams.spaceId;
    delete this.bodyParams.spaceId;
    if(spaceId !== ''){
      var id = Posts.insert(this.bodyParams);
      const space = Spaces.findOne({id: spaceId});
      if(space){
        Spaces.update(space._id, { $push: {posts: id }});
      }else{
        Spaces.insert({ posts: [id]});
      }
    }
    return {
      status: "success",
      _id: id
    }
  }
});

/**
 * @api {patch} /posts Update a post
 * @apiName UpdatePost
 * @apiGroup Post
 * 
 * @apiParam {String} id ID of the Post.
 *
 * @apiParam {String} title Title of the Post.
 * @apiParam {String} [body] Body of the Post.
 * @apiParam {Number} status Status of the Post (1 - 2 - 3).
 * @apiParam {Boolean} [internal] Type of the Post. Public or Internal.
 *
 * @apiSuccess {String} _id ID of the post.
 */

 /**
 * @api {posts} /posts Delete a post
 * @apiName DeletePost
 * @apiGroup Post
 * 
 * @apiParam {String} id ID of the Post.
 * 
 * @apiSuccess {String} _id ID of the post.
 */
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
      _id: this.urlParams.id
    }
  },
  delete: function(){
    Posts.remove(this.urlParams.id);
    return {
      status: "success"
    }
  }
});

// Comments collection routes
Api.addCollection(Comments);

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