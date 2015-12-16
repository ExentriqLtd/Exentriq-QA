const TYPE_POST = 1;
const TYPE_COMMENT = 2;

Meteor.methods({
  createCard: function (post) {
    check(post.title, String);
    check(post.userId, String);

    const user = Users.findOne(post.userId);
    const public = (user.profile.external) ? 'yes' : '';
    const spaceId = (user.profile.spaceId) ? user.profile.spaceId : '';

    try {
      var result = HTTP.call('POST',
        Meteor.settings.public.ema_url + '/api/cards/newQARequest',
        {
          "data":{
            title: post.title,
            qaId: post._id,
            description: post.body || '',
            qaId: post._id,
            spaceId: spaceId,
            fromAccount: user.username,
            public: public,
            members: []
          }
        }
      );

      return true;
    }catch(e){
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log("error", e);
      return false;
    }
  },

  syncCardComments: function(comment){
    check(comment.body, String);
    check(comment.postId, String);
    check(comment.author, String);

    try {
      var result = HTTP.call('POST',
        Meteor.settings.public.ema_url + '/api/cards/syncCommentsForQARequest',
        {
          "data":{
            qaId: comment.postId,
            comment: comment.body,
            author: comment.author
          }
        }
      );

      return true;
    }catch(e){
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log("error", e);
      return false;
    }
  },

  registerPlatformUser: function(username, email, external) {
    userId = Accounts.createUser({
      username: username,
      email: email,
      password: 'exentriq'
    });

    if(external)
      Users.update(userId,{ $set:{ 'profile.external': external } });

    return userId;
  },

  findUserByName: function(username){
    return Meteor.users.findOne({username: username}, { fields: {_id: 1}});
  },

  verifyToken: function(token) {
    check(token, String);

    // Try to retrieve user data from auth API
    var result = HTTP.call('POST', Meteor.settings.public.platform_url + '/JSON-RPC', {
      data: {
        id: '',
        method: 'auth.loginBySessionToken',
        params: [token]
      }
    });

    var userData = result.data.result;


    if (userData) {
      // If user not existing in Meteor, create user
      if(!Meteor.users.findOne({username: userData.username}, { fields: {_id: 1}})) {
        Accounts.createUser({username: userData.username, email: userData.email, password:'exentriq'});
      }

      // In any case, as long as we got a response from the auth API, just return this user data
      return userData;
    }

    // No user was retrieved from the auth API
    return null;

  },

  setExtraCSS: function(extraCSSUrl){
    check(extraCSSUrl, String);

    var content = HTTP.get(extraCSSUrl).content;
    if(!content)
      return false;

    const settings = Settings.find().fetch()[0];
    const property = { extraCSS: content }
    if(!settings){
      Settings.insert(property);
    }else{
      Settings.update(settings._id, { $set: property });
    }
  },

  appendEmaLink: function(postId) {
    check(postId, String);
    /*Posts.update(postId, {
      $set:
    });*/
  },

  sendNotification: function(source, params) {
    check(source, String);
    check(params, Object);

    var link = "",
      subject = "",
      spaceId = "",
      type = "",
      message = "";

    if (source == 'comments') {
      link = '/posts/' + params.postId + '/' + params.postSlug;
      subject = params.commentAuthor + ' ' + params.action + ' "' + s.truncate(params.commentBody, 15) + '"';
      type = 'qa-comment';
    }

    var postSpace = Spaces.findOne({posts: params.postId});
    if (postSpace) {
      spaceId = '?spaceid=' + postSpace.id;
    }


    HTTP.call(
      "POST",
      Meteor.settings.public.integration_bus_url + '/createEvent', {
        data: {
          event:"Notification",
          id:"",
          entities:[
            {
              name:"Notification",
              value: {
                from: params.commentAuthor,
                to: params.commenter,
                subject: subject,
                message: message,
                picture:  Meteor.settings.public.avatar_path + '/' + params.commenter + '.jpg',
                link: link + spaceId,
                type: type,
                postTitle: params.postTitle
              }
            }
          ]
        }
      },
      function (error, result) {
        if (error) {
          // Retry here ...
          console.log('Error saving notification to integration bus');
          console.log (error.message);
        }
      });
  }

});

