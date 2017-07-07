# E2E testing with cucumber, selenium-webdriver and docker-compose

## Fast info for the typing hungry

### Running in DEV mode
```
docker-compose run --rm tests
```

*Features*
- access website under test on [localhost:5000](http://localhost:5000/)
- access Selenium vnc viewerport on [localhost:5900](http://localhost:5900/)
- live edits and live-reload for website code written in React
- live edits and fast test run for test code using Cucumber.js
- zero complication with selenium setup

### Running in CI mode
```
docker-compose -f docker-compose.yml run tests && \
 docker-compose -f docker-compose.yml down
```

# E2E testing with cucumber, selenium and docker-compose

Browser based E2E tests are awesome. You just create a couple of lines of test code and you can cover several thousand lines of application logic and tons of css rule.

Browser based E2E tests are also a pain. They are usually felt fragile, complicated to develop and maintain, sometimes non-deterministic with a lot of false positive runs, and prone to break from a simple change in the markup.

Is all lost then? I hope not, so I collected what was learned from some recent experience - and share some tips on building an E2E environment that is less prone to the above issues and is more likely to hold on the longer run - and also fun to use.

## The tools used in this demo

#### Selenium WebDriver with Chrome
Selenium (webdriver) is like the [Khumbu Icefall](https://en.wikipedia.org/wiki/Khumbu_Icefall) when it comes to summitting the Everest from the South Col - there's no way around it. However with some simple tricks we can achieve decent reliability...

#### ~~Selenium WebDriver with Chrome Headless~~
Sorry guys, it's just not there yet - but very very close. Read  more at the end.

#### docker and docker-compose
Docker and docker-compose provides our sandbox that can spin up in any environments that has docker installed - letting us run the very same E2E test system in local development time or during the CI/CD pipeline.

#### selenium-webdriver library
Using the lowest level driver (okay, almost) provides a better understanding of the overall test system - and is `one less api and documentation` to know about.

#### gherkin style tests with Cucumber.js
It could be really anything, like mocha. For me however, working against plain English sentences, created potentially by someone non developer, helps creating test code that is more agnostic to the implementation.

## The big picture

Instead of relying on shared, permanent services, like a corp wide Selenium server, or a development webserver, we will have all our system components captured as docker images, started as dedicated containers - that exist just for the lifetime of a single test run. Each time we do a test run our required services will start afresh in perfect new condition - giving the highest chance for a predictable execution result. Also, instead of running the E2E test code using the webserver process, which is a common practice, we will run it in its dedicated worker process and container.

This all will be encapsulated in a docker-compose project, which serves as a sandbox, that wraps each test environments. This also lets the different service components to always know about each other without extra configuration effort. For example the test application can always access Selenium as `http://selenium` while the Selenium service can always access the website as `http://web`.

## The implementation

A fully built version of the test system can be found at https://github.com/jaystack/e2e_box.
### The test application
Source: https://github.com/jaystack/e2e_box/tree/master/tests

CUCUMBER INTRO COMES HERE

### The docker-compose setup

DOCKER-COMPOSE FILE AND USAGE DETAILED


### The test subject: a React web application
Source: https://github.com/jaystack/e2e_box/tree/master/web

Obviously it is  irrelevant what technlogy was used to create the solution we are about to test. What matters is that we need to create a containerized version of it that when started up will eventually launch our web service. It is a particularly simple process for a nodejs/React app - all it takes is a Docker file that we place in the website root. A very simple version of it, that expects a `build` and a `service` package script to do the appliction specific steps would look like this:

**web/Dockerfile**
```Dockerfile
FROM node:6
WORKDIR /app
ADD package-lock.json .
ADD package.json .
RUN npm i
ADD . .
RUN npm run build

ENTRYPOINT ["npm"]
CMD ["run","service"]

```
What happens is that the content of the web folder gets copied into the docker container, then node modules are installed and the application is built. Finally - the script that launches the website is set as startup commend for the container.

Its important to note that after we `ADD package\*.json` files, the next step is having the node modules installed with `RUN npm i`, and just _after_ it should we copy the whole application source with `ADD . .`. This way if we just change the source (but not the package definition files) the _docker image cache_ will speed up the  build process significantly.

Later on the docker-compose utility will use this file to build an image for us.
####



















