# FootballX Web UI
A web interface for viewing FootballX data. This utilizes the [FootballX API](http://dev.ttab.me:4646).

Quickstart
----
* Install Node.js (8.x or greater)
* `npm install`
* `npm start`
* Visit port 1810 on your development machine.
* Make some changes
* `npm run lint` to check your code for linting errors
* Submit a pull request. Wait for review and merge.
* `npm run build` to generate static outputs in `/build`

Configuration
----
* You can set the following environment variables:
  * REACT_APP_PORT: Changes the port that the development server runs on
  * REACT_APP_API_HOST: Changes the API that the UI requests data from (https://api.ttab.me)
  * REACT_APP_API_CMS: Changes the API that some dev-function requests data from (https://web-api.ttab.me)
  * REACT_APP_API_CMS: Changes the API that some dev-function requests data from (https://web-api.ttab.me)
  * REACT_APP_VERSION: API version, default v2
  * REACT_APP_HTTPS: allow start local server with https (for FB authentication)
  * ...

Dependences
---
* `npm fx-constants` Library for content data
* Update langs by crowdin.com

Tech Stack
----
* View: React
* State Management: Redux
* CSS: styled-components + Material UI v.1

Workflow
----
* Master branch for development
* Production branch is at https://footballx.live


Resources
----
* New to React/Redux? Read these articles on React and watch video tutorials by Redux creator Dan Abramov.
  * Thinking in React: https://facebook.github.io/react/docs/thinking-in-react.html
  * Getting started with Redux: https://egghead.io/courses/getting-started-with-redux
  * Idiomatic Redux: https://egghead.io/courses/building-react-applications-with-idiomatic-redux
  * ES6 guide: https://github.com/lukehoban/es6features

