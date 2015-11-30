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
        Meteor.settings.public.ema_url + 'api/cards/newQARequest',
        {
          "data":{
            title: post.title,
            description: post.body || '',
            spaceId: spaceId,
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

  sendNotification: function(doc, type){
    check(doc.title, String);
    check(doc._id, String);
    check(doc.userId, String);

    var from = Meteor.users.findOne(doc.userId).username
    var to  = '';
    var action = '';
    if(type === TYPE_POST)
      action = 'Created a new post';
    if(type === TYPE_COMMENT)
      action = 'Commented on a post';
    var subject = from + ' ' + action + ' '+ doc.title;
    var link = '/posts/' + doc._id;

    try {
      var result = HTTP.call("POST",
        Meteor.settings.public.integration_bus_url, {
          data: {
            event: "Notification",
            id: "",
            entities:[
              {
                name:"Notification",
                value: {
                  from: from,
                  to: to,
                  subject: subject,
                  message: '',
                  picture: Meteor.settings.public.avatar_path + from + '.jpg',
                  link: link
                }
              }
            ]
          }
        });

      return true;
    }catch(e){
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.error("error", e);
      console.log("error", "cannot save notification to integration bus");
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
    var result = HTTP.call('POST', Meteor.settings.public.stage_url, {
      data: {
        id: '',
        method: 'auth.loginBySessionToken',
        params: [token]
      }
    });

    return result;
  }

});
