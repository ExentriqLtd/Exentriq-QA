Template.posts_list_controller.helpers({
  template: function () {
    return !!this.template? this.template: "posts_list";
  },
  data: function () {

    var context = this;

    var template = Template.instance();

    var terms = template.rTerms.get(); // ⚡ reactive ⚡
    var postsReady = template.rReady.get(); // ⚡ reactive ⚡

    var parameters = Posts.parameters.get(terms);
    
    // Add the term spaceid from queryParam
    parameters.find._id = { $in: [] };
    if(terms.spaceid){
      const space = Spaces.findOne({id: terms.spaceid});
      if(space && space.posts){
        parameters.find._id = { $in: space.posts };
      }
    }

    var postsCursor = Posts.find(parameters.find, parameters.options);

    // if (debug) {
    //   console.log("// -------- data -------- //")
    //   console.log("terms: ", terms);
    // }

    var data = {

      // posts cursor
      postsCursor: postsCursor,

      // posts subscription readiness, used to show spinner
      postsReady: postsReady,

      // whether to show the load more button or not
      hasMorePosts: postsCursor.count() >= terms.limit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (template) {
        // increase limit by 5 and update it
        var limit = template.rLimit.get();
        limit += Settings.get('postsPerPage', 10);
        template.rLimit.set(limit);
      },

      // the current instance
      controllerInstance: template,

      controllerOptions: context.options // pass any options on to the template

    };

    return data;
  }
});