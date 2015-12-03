const TYPE_POST = 1;
const TYPE_COMMENT = 2;

Meteor.methods({
  createCard: function (post) {
    check(post.title, String);
    check(post.userId, String);

    const user = Users.findOne(post.userId);
    const spaceId = (user.profile.spaceId) ? user.profile.spaceId : '';

    try {
      var result = HTTP.call('POST',
        Meteor.settings.public.ema_url + '/api/cards/newQARequest',
        {
          "data":{
            title: post.title,
            description: post.body || '',
            spaceId: spaceId,
            fromAccount: user.username,
            //public: true,
            members: []
          }
        }
      );

      return true;
    }catch(e){
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log("error", e)
      return false;
    }
  },

  registerPlatformUser: function(username, email) {
    userId = Accounts.createUser({username: username, email: email, password:'exentriq'});
    return userId;
  },

  findUserByName: function(username){
    return Meteor.users.findOne({username: username}, { fields: {_id: 1}});
  },

  verifyToken: function(token) {
    var result = HTTP.call('POST', Meteor.settings.public.stage_url + '/JSON-RPC', {
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
  }

});

