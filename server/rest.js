// Global API configuration
var Api = new Restivus({
  prettyJson: true,
  apiPath: 'custom-api'
});

/**
 * @api {get} /posts Request posts collection
 * @apiVersion 0.1.0
 * @apiName GetPosts
 * @apiGroup Post
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

/**
 * @api {post} /posts Create new post
 * @apiVersion 0.1.0
 * @apiName CreatePost
 * @apiGroup Post
 * 
 * @apiParam {String} title Title of the Post.
 * @apiParam {String} [body] Body of the Post.
 * @apiParam {Number} status Status of the Post (1 - 2 - 3).
 * @apiParam {Boolean} [internal] Type of the Post. Public or Internal.
 * @apiParam {String} [spaceId] Space in which the post is goin to be inserted.
 * @apiParam {String} [backToMyRoots] The post origin url in EMA.
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
        Spaces.insert({ id:spaceId , posts: [id]});
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
 * @apiVersion 0.1.0
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
 * @api {post} /posts Delete a post
 * @apiVersion 0.1.0
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

/**
 * @api {post} /users Create new user
 * @apiVersion 0.1.0
 * @apiName CreateUser
 * @apiGroup User
 * 
 * @apiParam {String} username Username of the user.
 * @apiParam {String} email Email of the user.
 *
 * @apiSuccess {String} _id ID of the new user.
 */
Api.addRoute('users', {authRequired: false}, {
  post: function() {
    try {
      check(this.bodyParams.username, String);
      check(this.bodyParams.email, String);

      var platformUsername = this.bodyParams.username;
      var platformEmail = this.bodyParams.email;
      var id = Accounts.createUser({username: username, email: email, password:'exentriq'});

      return {
        status: 'success',
        id: id
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

/**
 * @api {get} /user/:name Request User information
 * @apiVersion 0.1.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} name Users unique Name.
 *
 * @apiSuccess {String} _id ID of the User.
 * @apiSuccess {String} username  Username of the User.
 * @apiSuccess {Object} profile  Profile of the User.
 *
 * @apiError UserNotFound No User match is found.
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