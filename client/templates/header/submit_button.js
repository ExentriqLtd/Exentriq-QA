Template.submit_button.helpers({
  options: function(){
  	if(document.referrer === Meteor.settings.public.parent_exec && !Meteor.user()){
  		return {
  			href: "http://exentriq01.stage.exeq.me/signin",
  			target: "_parent"
  		}
  	}else{
  		return {
  			href: "submit"
  		};
  	}
  }
});
