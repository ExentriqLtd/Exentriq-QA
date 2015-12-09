// ---------------------- Ensure user is logged in--------------------
FlowRouter.triggers.enter([checkLoggedIn], {except: ["doLogin"]});

function redirectToLogin(sessionToken, path){
  Session.set('sessionToken', sessionToken);
  Session.set('redirectTo', path);
  FlowRouter.redirect('/doLogin?sessionToken=' + sessionToken);
}

function checkLoggedIn(ctx, redirect){
  const sessionToken = ctx.queryParams.sessionToken;
  if(!sessionToken)
    return;
  else if(sessionToken === '-1'){
    Meteor.logout();
    return;
  }

  if(!Meteor.user()){
    redirectToLogin(sessionToken, ctx.path)
  }else if(sessionToken !== Session.get('sessionToken')) {
    Meteor.logout();
    redirectToLogin(sessionToken, ctx.path)
  }
}

function loginUser(username){
  Meteor.loginWithPassword(username, 'exentriq', function(error){
    console.log(error)
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
            email = data.email,
            external = data.type === 'EXTERNAL';
        Meteor.call('findUserByName', data.username, function(error, result){
          if(!error && result !== undefined){
            loginUser(username);
          }else{
            Meteor.call('registerPlatformUser', username, email, external,
            function (error, result) {
              var redirectTo = Session.get('redirectTo') || '/';
              FlowRouter.redirect(redirectTo);
            });
          }
        })
      }else
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

FlowRouter.triggers.enter([handleExtraCSS], {except: ["doLogin"]});

function handleExtraCSS(ctx, redirect){
  const extraCSSLink = ctx.queryParams.css;
  if(extraCSSLink){
    Meteor.call('setExtraCSS', extraCSSLink, function (error, result) {
      if(!error)
        console.log('setting extra css from url: ' + extraCSSLink)
    });
  }
}