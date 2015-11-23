FlowRouter.route('/doLogin', {
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

function loginUser(username){
  Meteor.loginWithPassword(username, 'exentriq', function(error){
    if(!error)
      FlowRouter.redirect('');
    else
      console.log('Sorry but you cannot do this.')
  })
}