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
 *
 * @apiSuccess {String} _id ID of the post.
 * @apiSuccess {String} title Title of the post.
 * @apiSuccess {Number} status Status of the post.
 * @apiSuccess {Number} commentsCount Number of comments of the post.
 * @apiSuccess {Boolean} internal Type of the post.
 * @apiSuccess {String} userId User or author of the post.
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
    var id = Posts.insert(this.bodyParams);
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