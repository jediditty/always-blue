import auth0 from 'auth0-js';
import history from './history';
import {
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage,
} from '../utils/localStorage';

export default class Auth {
  constructor(redirectUri) {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: redirectUri,
      responseType: 'token id_token',
      scope: 'openid profile',
    });
    this.login = this.login.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  login(path) {
    let state = { path };
    this.auth0.authorize({
      state: JSON.stringify(state),
    });
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((error, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          let { path } = JSON.parse(authResult.state);
          path = path || '/';
          this.setSession(authResult);
          history.replace(path);
          resolve(authResult);
        } else if (error) {
          history.replace('/');
          reject({ error });
        }
      });
    });
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    setLocalStorage('access_token', authResult.accessToken);
    setLocalStorage('id_token', authResult.idToken);
    setLocalStorage('expires_at', expiresAt);
  }

  logout() {
    // Clear all values stored in local storage
    clearLocalStorage();
    // navigate to the home route
    history.replace('/');
  }

  isValid() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = getLocalStorage('expires_at');
    return new Date().getTime() < expiresAt;
  }

  getAccessToken() {
    return getLocalStorage('access_token');
  }

  getUserProfile() {
    const userProfile = getLocalStorage('user_profile');

    if (!userProfile) {
      let accessToken = getLocalStorage('access_token');

      if (!accessToken) {
        return { error: 'Not Logged in' };
      }

      return new Promise((resolve, reject) => {
        this.auth0.client.userInfo(accessToken, function(error, profile) {
          if (profile) {
            setLocalStorage('user_profile', profile);
            resolve(profile);
          } else {
            reject({ error });
          }
        });
      });
    } else {
      return userProfile;
    }
  }
}
