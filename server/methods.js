const CREATE_CARD_PATH = 'http://boards.stage.exentriq.com/api/cards/createCard';

Meteor.methods({
  createCard: function (title, description) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    check(title, String);
    check(description, String);

    try {
      var result = HTTP.call('POST',
        CREATE_CARD_PATH,
        { 
          "data":{
            title: title,
            description: description,
            username: Meteor.user().username
          }
        }
      );

      return true;
    }catch(e){
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log("error", e)
      return false;
    }
  }
});