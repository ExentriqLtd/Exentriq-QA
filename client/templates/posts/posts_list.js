Template.posts_list.rendered = function(){
  const spaceId =  FlowRouter.getQueryParam('spaceid');
  if(!spaceId)
    return;

  // update user profile with spaceId to retrieve it later in post insertion
  Users.update(Meteor.userId(),{
    $set:{
      'profile.spaceId': spaceId
    }
  });

  // insert new post 
  if(!Spaces.findOne({id: spaceId})){
    Spaces.insert({id: spaceId});
  }
}