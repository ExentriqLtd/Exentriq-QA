// setup a new user spaceid for every new login
var onSignFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      console.log('hello')
    }
    if (state === "signUp") {
      // Successfully registered
    }
  }
};

AccountsTemplates.configure({
    onSubmitHook: onSignFunc
});

// When signing up with a spaceID param or field, it will be added to user profile space
// id field 
AccountsTemplates.addFields([
  {
    _id: "spaceId",
    type: "text",
    displayName: "Space ID",
  }
])

Template.registerHelper('isStandalone', function(){
  return window.self === window.top;
});

FlowRouter.route('/dologin', {
  action: function(params, queryParams) {
    const username = queryParams.username;
    Meteor.loginWithPassword(username, '', function(error){
      if(!error)
        FlowRouter.redirect('');
      else
        console.log('Sorry but you cannot do this.')
    })
  }
});