import firebase from './firebase-config';
import 'firebase-auth';

export const githubProvider = new firebase.auth.GithubAuthProvider();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
