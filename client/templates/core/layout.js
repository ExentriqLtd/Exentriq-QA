Template.layout.helpers({
  appIsReady: function () {
    return FlowRouter.subsReady() && !Session.get('isLoggingIn');
  }
});