/**
 * Helper functions for returning information from the Redux Store.
 * Although normally this could be done directly in the `mapStateToProps`
 * function, this approach makes it easier to change the shape of the store.
 */

export const isUserAuthenticated = state => {
  return state.profile.token;
};

export const isLogInRequesting = state => {
  return state.login.requesting;
};

export const isSignUpRequesting = state => {
  return state.login.requesting;
};

export const getMessages = state => {
  return state.messages;
};
