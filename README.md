<h1 align="center">Welcome to fullstack-challenge-2021-coodesh-api 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: UNLICENSED" src="https://img.shields.io/badge/License-UNLICENSED-yellow.svg" />
  </a>
</p>

<div align="center">
  <h3 align="center">Coodesh Challenge</h3>
  <p align="center">
  an incredible project that extracts products from a web page and serves in a REST API
  </p>
  <br/>
  <a href="https://lab.coodesh.com/wja1/fullstack-challenge-2021?utm_source=mail&utm_medium=sendgrid&utm_campaign=website"><strong>For more information see the challenge repository</strong></a>

</div>

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

- [Nest.js](https://nestjs.com/)
- [Mongoosejs](https://mongoosejs.com/)
- [MongoDb](https://www.mongodb.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/docs/getting-started/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Cheerio](https://cheerio.js.org/)

<!-- GETTING STARTED -->

## Getting Started

Instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

List things you need to use the software and how to install them.

#### Roadmap

- [x] docker
- [x] docker compose

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/wdev007/coodesh-fullstack-challenge-2021-api
   ```
2. Change the settings files
   ```sh
   cp .env.example .env
   ```
3. Customize the time to run the import job in `config.yaml`
   ```yaml
   scheduling:
     cron: '*/30 * * * *'
   ```

## Usage

```sh
docker-compose up
```

## Run tests

```sh
yarn run test
```

## Author

👤 **Wellici Araujo**

- Github: [@wdev007](https://github.com/wdev007)

## Show your support

Give a ⭐️ if this project helped you!

---

_[Challenge by coodesh](https://coodesh.com/)_
