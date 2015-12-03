const TYPE_POST = 1;
const TYPE_COMMENT = 2;

// Server callbacks
function createCardOnPostSubmit(post) {
	Meteor.call('createCard', post);
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
