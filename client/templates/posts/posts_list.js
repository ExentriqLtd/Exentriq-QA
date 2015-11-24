// Override posts cursor to get those in current spaceId
Template.posts_list.helpers({
  postsCursor : function () {
    if (this.postsCursor) { // not sure why this should ever be undefined, but it can apparently
      const spaceId =  FlowRouter.getQueryParam('spaceid');
      const space = Spaces.findOne({id: spaceId});
      if(space){
        const postsInSpace = space.posts;
        this.postsCursor = Posts.find({_id: { $in: postsInSpace} })
      }

      var posts = this.postsCursor.map(function (post, index) {
        post.rank = index;
        return post;
      });
      return posts;
    } else {
      console.log('postsCursor not defined');
    }
  }
});