Meteor.publish("spaces", function () {
  return Spaces.find({});
});