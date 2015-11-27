Template.logo.helpers({
  homeUrl: function(){
  	if(Session.get("currentSpace"))
    	return '/?spaceid=' + Session.get("currentSpace");
    else
    	return '/';
  }
});
