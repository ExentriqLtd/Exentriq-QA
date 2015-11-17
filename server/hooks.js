const TYPE_POST = 1;
const TYPE_COMMENT = 2;

function createCardOnPostSubmitClient (post) {
	Meteor.call('createCard', post, function (error, result) {
		// if(error === undefined)
		// 	console.log(result);
		// else
		// 	console.log(error);
	});
}

function sendNotificationOnPostSubmitClient(post){
	Meteor.call('sendNotification', post, TYPE_POST, function (error, result) {
		// if(error === undefined)
		// 	console.log(result);
		// else
		// 	console.log(error);
	});
}

function sendNotificationOnCommentSubmitClient(comment){
	Meteor.call('sendNotification', comment, TYPE_COMMENT, function (error, result) {
		// if(error === undefined)
		// 	console.log(result);
		// else
		// 	console.log(error);
	});
}

Telescope.callbacks.add("postSubmitAsync", createCardOnPostSubmitClient);
Telescope.callbacks.add("postSubmitAsync", sendNotificationOnPostSubmitClient);
Telescope.callbacks.add("commentSubmitAsync", sendNotificationOnCommentSubmitClient);

