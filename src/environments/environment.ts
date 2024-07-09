// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  fcmUrl: 'https://fcm.googleapis.com/fcm/send',
  fcmServerKey:
    // eslint-disable-next-line max-len
    'AAAALU77iE0:APA91bFD2NmBJ_SPH8JzcsPqextjhtN8y6Xr8xHqjlnm3XPFRM476EUyiJv0KEiXUV-YQZfx4gj5CMTIXgFBxrjfg4iLqfLL0YtlOjeAqLhk-k6pm5mVms8pgqo4sTQZMJXVVK3UZ-1u',
  firebase: {
    apiKey: "AIzaSyAW6pGQhNB0SAjYvbuUPevtGc2WL3CNUgQ",
    authDomain: "lacomanda-c8c6b.firebaseapp.com",
    projectId: "lacomanda-c8c6b",
    storageBucket: "lacomanda-c8c6b.appspot.com",
    messagingSenderId: "194598635597",
    appId: "1:194598635597:web:55b78e4c7681419340f404"
  },
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
