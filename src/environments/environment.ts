// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  BASE_URL: 'http://localhost:4200',
  firebase: {
    apiKey: "AIzaSyBFc6CmLLZYliPnvhk8Bwdoz0dYuveHGRE",
    authDomain: "market-datamanu.firebaseapp.com",
    databaseURL: "https://market-datamanu.firebaseio.com",
    projectId: "market-datamanu",
    storageBucket: "market-datamanu.appspot.com",
    messagingSenderId: "157510666122"
  }
};
