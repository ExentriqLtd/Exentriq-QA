
// Server callbacks
function createCardOnPostSubmit(post) {
	Meteor.call('createCard', post);
}

function updateCardOnCommentSubmit(comment) {
  Meteor.call('syncCardComments', comment);
}

function addSpaceOnPostSubmit(post){
	var spaceId = Users.findOne(post.userId).profile.spaceId;
	var space = Spaces.findOne({id: spaceId});
	if(space){
		Spaces.update(space._id, { $push: { posts: post._id } });
	}
}

Telescope.callbacks.add("postSubmitAsync", createCardOnPostSubmit);
Telescope.callbacks.add("postSubmitAsync", addSpaceOnPostSubmit);
Telescope.callbacks.add("commentSubmitAsync", updateCardOnCommentSubmit);
