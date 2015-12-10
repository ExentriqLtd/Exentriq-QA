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
    FlowRouter.setQueryParams({ sessionToken: undefined })
    verifyToken(sessionToken, ctx.path);
  }
}

function verifyToken(sessionToken, redirectTo){
  Meteor.call('verifyToken', sessionToken, function (error, result) {
    var data = result.data.result;
    if(data !== null){
      var username = data.username,
          email = data.email,
          external = (data.type === 'EXTERNAL');
      Meteor.call('findUserByName', data.username, function(error, result){
        if(!error && result !== undefined){
          loginUser(username, redirectTo);
        }else{
          Meteor.call('registerPlatformUser', username, email, external, function (error, result) {
            FlowRouter.redirect('/');
          });
        }
        Session.set('isLoggingIn', false);
      })
    }else
      console.log('invalid token, please contact the administrator');
  });
}

function loginUser(username, redirectTo){
  Meteor.loginWithPassword(username, 'exentriq', function(error){
    if(error){
      console.log(error);
      return;
    }
    FlowRouter.redirect('/');
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
  if(extraCSSLink){
    Meteor.call('setExtraCSS', extraCSSLink, function (error, result) {
      if(!error){
        FlowRouter.setQueryParams({ css: undefined })
        console.log('setting extra css from url: ' + extraCSSLink);
      }
    });
  }
}