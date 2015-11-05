function createCardOnPostSubmitClient (modifier, post) {

	Meteor.call('createCard', modifier.title, modifier.body, function (error, result) {
		if(error === undefined)
			console.log(result)
		else
			console.log(error)
	});

  return modifier;
}

Telescope.callbacks.add("postSubmit", createCardOnPostSubmitClient);