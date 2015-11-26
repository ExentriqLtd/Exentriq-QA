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

Template.registerHelper('backToEmaUrl', function(){
	var postId = FlowRouter.getParam('_id');
  return Posts.findOne(postId).backToMyRoots || false;
});

// setup a new user spaceid for every new login
// var onSignFunc = function(error, state){
//   if (!error) {
//     if (state === "signIn") {
//       console.log('hello')
//     }
//     if (state === "signUp") {
//       // Successfully registered
//     }
//   }
// };

// AccountsTemplates.configure({
//     onSubmitHook: onSignFunc
// });
