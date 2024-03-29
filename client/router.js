// ---------------------- Ensure user is logged in--------------------
FlowRouter.triggers.enter([checkLoggedIn]);

function checkLoggedIn(ctx, redirect){
  const sessionToken = ctx.queryParams.sessionToken;
  if(!sessionToken)
    return;

  Session.set('isLoggingIn', true)
  if(sessionToken === '-1'){
    Meteor.logout(function(){
      Session.set('isLoggingIn', false);
    });
  }else{
    Session.set('sessionToken', sessionToken);
    // remove the session token from query params, otherwise this causes
    // infinite redirects
    FlowRouter.setQueryParams({ sessionToken: undefined });
    console.log(FlowRouter._current.path)
    verifyToken(sessionToken, FlowRouter._current.path);
  }
}

function verifyToken(sessionToken, redirectTo){
  Meteor.call('verifyToken', sessionToken, function (error, result) {
    var userData = result;
    console.log(error);
    if(userData){
      loginUser(userData.username, redirectTo);
    }else{
      console.log('invalid token, please contact the administrator');
    }
    Session.set('isLoggingIn', false);
  });
}

function loginUser(username, redirectTo){
  Meteor.loginWithPassword(username, 'exentriq', function(error){
    if(error){
      console.log(error);
      return;
    }
    FlowRouter.redirect(redirectTo);
  })
}

// ------------------------ Handle spaceID ----------------------

FlowRouter.triggers.enter([handleSpaceId]);

function handleSpaceId(ctx, redirect){
  Meteor.subscribe('spaces', function(){
    const spaceId = ctx.queryParams.spaceid;

    if(!spaceId){
      if(Session.get('currentSpace'))
        FlowRouter.setQueryParams({ spaceid: Session.get('currentSpace') })
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

// ------------------------ Handle Extra CSS ----------------------

FlowRouter.triggers.enter([handleExtraCSS]);

function handleExtraCSS(ctx, redirect){
  const extraCSSLink = ctx.queryParams.css;
  if(extraCSSLink && !Session.get('isLoggingIn')){
    Meteor.call('setExtraCSS', extraCSSLink, function (error, result) {
      if(!error){
        FlowRouter.setQueryParams({ css: undefined })
        console.log('setting extra css from url: ' + extraCSSLink);
      }
    });
  }
}
