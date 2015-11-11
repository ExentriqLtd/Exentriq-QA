

var mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      // console.log('signed in')
    }
    if (state === "signUp") {
      // Successfully registered
      // ...
    }
  }
};

AccountsTemplates.configure({
    onSubmitHook: mySubmitFunc
});