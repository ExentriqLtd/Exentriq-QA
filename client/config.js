// When signing up with a spaceID param or field, it will be added to user profile space
// id field
AccountsTemplates.addFields([
  {
    _id: "spaceId",
    type: "text",
    displayName: "Space ID",
  }
])

Template.registerHelper('showFullNav', function(){
  if(FlowRouter.getQueryParam('view') === 'support' || Session.get('view') === 'support') {
    Session.set('view', 'support');
    return true;
  }
  return window.self === window.top;
});

Template.registerHelper('isExentriqSupportOrStandalone', function(){
  if(FlowRouter.getQueryParam('view') === 'support' || Session.get('view') === 'support') {
    Session.set('view', 'support');
    return true;
  }
  return window.self === window.top;
});

Template.registerHelper('backToEmaUrl', function(){
	var postId = FlowRouter.getParam('_id');
	var post = Posts.findOne(postId);
	if(post && post.backToMyRoots){
    // We persist the back url in the session to enable back to ema link in app wide
    Session.set('post.backToMyRoots', post.backToMyRoots);
		return post.backToMyRoots;
  }
  if(Session.get('post.backToMyRoots')){
    return Session.get('post.backToMyRoots');
  }
});