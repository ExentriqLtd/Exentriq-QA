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