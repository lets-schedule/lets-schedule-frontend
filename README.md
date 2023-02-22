# Let's Schedule (Frontend)

This is the frontend mobile app for Let's Schedule, implemented in React Native and written in Typescript. The app will connect to the backend server via the REST api, and allow the user to sign in and view/edit their calendar. It will also handle the automatic scheduling of events, and push notifications.

Directory Structure:
- `src/`: Typescript source files
- `__tests__/`: React Native tests
- `android/`: Android native code
- `ios/`: iOS native code
- `.bundle/`: Ruby Bundle configuration (for CocoaPods)
- `package.json`: npm dependencies for the app
- `src/components`: component's code files
- `App.tsx`: the main entry point of the application
- Root: Configuration files for React, Node, NPM, Ruby, Typescript, linters

### Required Source Code
- Access the _Let's Schedule Backend_ [here](https://github.com/lets-schedule/lets-schedule-backend)

### Software Building
- Download and install react native as well as Node, JDK, Android Studio, and Android SDK as described [here](https://reactnative.dev/docs/environment-setup)
- Execute `$ npm install` command to download and install all dependencies
- Start with `$ npm start`

### Testing
- Refer to [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- Run all test with `$ npm test`
- New tests should be added to `__tests__` directory

### Build a Release
- Go to `android` directory by executing `$ cd android`
- Execute `$ ./gradlew bundleRelease`
- Refer to [official documentation](https://reactnative.dev/docs/signed-apk-android#generating-the-release-aab)