const TYPE_POST = 1;
const TYPE_COMMENT = 2;

// Server callbacks
function createCardOnPostSubmit(post) {
	Meteor.call('createCard', post);
}

function sendNotificationOnPostSubmit(post){
	Meteor.call('sendNotification', post, TYPE_POST, function (error, result) {});
}

function sendNotificationOnCommentSubmit(comment){
	Meteor.call('sendNotification', comment, TYPE_COMMENT, function (error, result) {});
}

function addSpaceOnPostSubmit(post){
	var spaceId = Users.findOne(Meteor.userId).profile.spaceId;
	var space = Spaces.findOne({id: spaceId});
	if(space){
		if(Spaces.findOne({_id: space._id, posts: post._id}))
			return;
		Spaces.update(space._id, { $push: { posts: post._id } });
	}
}

Telescope.callbacks.add("postSubmitAsync", createCardOnPostSubmit);
Telescope.callbacks.add("postSubmitAsync", sendNotificationOnPostSubmit);
Telescope.callbacks.add("commentSubmitAsync", sendNotificationOnCommentSubmit);
Telescope.callbacks.add("postSubmitAsync", addSpaceOnPostSubmit);
