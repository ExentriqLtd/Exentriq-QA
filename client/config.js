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
  if(FlowRouter.getQueryParam('view') === 'support')
    return true;
  return window.self === window.top;
});

Template.registerHelper('backToEmaUrl', function(){
  if(FlowRouter.getQueryParam('view') === 'support')
    return false;
	var postId = FlowRouter.getParam('_id');
	var post = Posts.findOne(postId);
	if(post && post.backToMyRoots){
    // We persist the back url in the session to enable back to ema link in app wide
    Session.set('post.backToMyRoots', post.backToMyRoots);
		return post.backToMyRoots;
  }else if(Session.get('post.backToMyRoots')){
  	return Session.get('post.backToMyRoots');
  }else{
    return false;
  }
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
