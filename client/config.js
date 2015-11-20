
// setup a new user spaceid for every new login
var onSignFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      var spaceid = FlowRouter.getQueryParam('spaceid');
      console.log(FlowRouter.getRouteName())
      console.log(spaceid)
      if(spaceid){
        Users.update(Meteor.user()._id, {
          $set: {
            'profile.spaceId': spaceid
          }
        });
      }
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