<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### NestJS Basics 2 - Challenges
#### Cyber Chat

Build the foundation of a threaded discussion app using NestJS modules, controllers, services, and providers. The discussion app can only be used via API, so you don’t have to worry about building a frontend. For now, the data will be stored in memory.

#### Data

```ts
type Thread = {
  id: number;
  title: string;
  author: string;
  body: string;
  createdAt: Date;
};

type Comment = {
  id: number;
  author: string;
  body: string;
  createdAt: Date;
};
```

#### Modules

- Create `ThreadsModule` and `CommentsModule`, both imported into `AppModule`.

#### Providers

- Build `ThreadsRepository` and `CommentsRepository` as injectable providers. Store data in memory using `Map<string, Thread>` and `Map<string, Comment>`.
- Build `ThreadsService` and `CommentsService`, each depending on its repository via constructor injection.

#### Controllers

| Method   | Route                   | Purpose                                                                    |
| -------- | ----------------------- | -------------------------------------------------------------------------- |
| `POST`   | `/threads`              | Create a thread with title and body                                        |
| `GET`    | `/threads`              | List all threads                                                           |
| `GET`    | `/threads/:id`          | Get one thread including its comments                                      |
| `POST`   | `/threads/:id/comments` | Add a comment to a thread                                                  |
| `DELETE` | `/threads/:id/`         | Deletes the thread and all of its comments (comments are actually deleted) |
| `GET`    | `/comments/:id/`        | Get one comment                                                            |
| `DELETE` | `/comments/:id/`        | Special: Does not delete the comment, but sets its body to `"deleted"`     |

#### Bonus Task

- Throw a proper `NotFoundException` when a thread doesn’t exist.

### NestJS TypeORM - Challenges
#### Cyber Chat - Add a Persistent Storage

Until now, Cyber Chat has relied on in-memory arrays. Every time you restart the development server, all threads and comments vanish. In this challenge, you will rip out those volatile repositories and wire the application to a real, persistent SQLite database.

#### 1. The Foundation

- Bring the `SQLite` driver and `TypeORM` dependencies into your existing `Cyber Chat` project.
- Configure the connection in your root `AppModule`.
- Create a new `SQLite` database file.

#### 2. Modeling the Domain

Translate your domain into `TypeORM` entities. You will need a `Thread` and a `Comment`. The requirements for the `Thread` entity could be:

- A `UUID` primary key.
- A standard string `title` and a `text` body.
- An auto-managed `createdAt` timestamp.
- A simple string `author` (a placeholder for a future user system).

Design the `Comment` entity.

Hint:

#### 3. The Repository Swap

- Delete your custom in-memory repository classes. They are obsolete.
- Update your `ThreadService` and `CommentService` to inject TypeORM’s generic `Repository`.
- Refactor your business logic to use the database methods instead of array manipulation.

#### 4. The Initial Migration (Optional)

- Disable `synchronize`.
- Set up your `src/data-source.ts` file and add the `TypeORM CLI` scripts to your `package.json`.
- Generate your first schema migration, review the generated SQL, and execute the run command to build your database tables.

#### Acceptance Criteria

- Persistence: You can create a `Thread` via a `POST` request, restart your `NestJS` server, make a `GET` request, and the `Thread` is still there.
- Relational Integrity: Fetching a `Thread` by its `ID` successfully returns the `Thread` along with its associated array of `Comments`.
- Clean Services: Your service classes contain no raw SQL strings and no manual array-filtering logic (`.filter`, `.push`). All data manipulation is delegated to the `ORM`.
- Migration Verification: A generated migration file exists in `src/migrations`, and the `CLI` reports it as successfully applied.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
