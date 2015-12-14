const TYPE_POST = 1;
const TYPE_COMMENT = 2;

Meteor.methods({
  syncCard: function (post) {
    check(post.title, String);
    check(post.userId, String);

    const user = Users.findOne(post.userId);
    const public = (user.profile.external) ? 'yes' : '';
    const spaceId = (user.profile.spaceId) ? user.profile.spaceId : '';
    var comments = Comments.find({postId: post._id});

    try {
      var result = HTTP.call('POST',
        Meteor.settings.public.ema_url + '/api/cards/syncQARequest',
        {
          "data":{
            title: post.title,
            description: post.body || '',
            qaId: post._id,
            spaceId: spaceId,
            fromAccount: user.username,
            public: public,
            members: [],
            comments: comments
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
    var result = HTTP.call('POST', Meteor.settings.public.platform_url + '/JSON-RPC', {
      data: {
        id: '',
        method: 'auth.loginBySessionToken',
        params: [token]
      }
    });

    return result;
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
  }

});

