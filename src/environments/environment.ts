// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBhHvSW0eFazK_hkqrBU1aYzv3z8NsKp5Y",
    authDomain: "ioniclogin-79302.firebaseapp.com",
    projectId: "ioniclogin-79302",
    storageBucket: "ioniclogin-79302.appspot.com",
    messagingSenderId: "713048455918",
    appId: "1:713048455918:web:7be1c25fb202eae75c11ff"
  },
  countryJson: [
    {"name":"Israel","dial_code":"+972","code":"IL"},
    {"name":"Afghanistan","dial_code":"+93","code":"AF"},
    {"name":"Albania","dial_code":"+355","code":"AL"},
    {"name":"Algeria","dial_code":"+213","code":"DZ"},
    {"name":"AmericanSamoa","dial_code":"+1 684","code":"AS"},
    {"name":"Colombia","dial_code":"+57","code":"CO"}
  ],
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
