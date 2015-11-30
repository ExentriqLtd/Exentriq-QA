// ---------------------- Ensure user is logged in--------------------
FlowRouter.triggers.enter([checkLoggedIn], {except: ["doLogin"]});

function checkLoggedIn(ctx, redirect){
  if(!Meteor.userId() && ctx.queryParams.sessionToken){
    Session.set('sessionToken', ctx.queryParams.sessionToken);
    Session.set('redirectTo', ctx.path);
    redirect('/doLogin?sessionToken=' + ctx.queryParams.sessionToken);
  }
}

function loginUser(username){
  Meteor.logout();
  Meteor.loginWithPassword(username, 'exentriq', function(error){
    if(!error){
      var redirectTo = Session.get('redirectTo') || '/';
      FlowRouter.redirect(redirectTo);
      Session.set('redirectTo', undefined);
    }else
      console.log('Sorry but you cannot do this.')
  })
}

FlowRouter.route('/doLogin', {
  name: 'doLogin',
  action: function(params, queryParams) {
    const sessionToken = queryParams.sessionToken;
    Meteor.call('verifyToken', sessionToken, function (error, result) {
      var data = result.data.result;
      if(data !== null){
        var username = data.username,
            email = data.email;
        Meteor.call('findUserByName', data.username, function(error, result){
          if(!error && result !== undefined){
            loginUser(username);
          }else{
            Meteor.call('registerPlatformUser', username, email, function (error, result) {});
          }
        })
      }
      else
        console.log('invalid token, please contact the administrator');
    });
  }
});

// ------------------------ Handle spaceID ----------------------

FlowRouter.triggers.enter([handleSpaceId], {except: ["doLogin"]});

function handleSpaceId(ctx, redirect){
  Meteor.subscribe('spaces', function(){
    const spaceId = ctx.queryParams.spaceid;
    
    if(!spaceId){
      if(Meteor.user().profile.spaceId)
        FlowRouter.setQueryParams({ spaceid: Meteor.user().profile.spaceId })
      return;
    }

    // update user profile with spaceId to retrieve it later in post insertion
    Users.update(Meteor.userId(),{
      $set:{
        'profile.spaceId': spaceId
      }
    });

    Session.set('currentSpace', spaceId);
    
    // insert new space
    if(!Spaces.findOne({id: ''+spaceId})){
      Spaces.insert({id: spaceId});
    }
  });
}