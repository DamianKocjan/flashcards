<!-- ![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png) -->

# Flashcardz

Flashcardz is an educational platform to help with learning words and definitions in other languages.

## Tech Stack

- [NextJS](https://nextjs.org/)
- [Typescript](https://typescriptlang.org)
- [Prisma](https://prisma.io)
- [Trpc](https://trpc.io)
- [Clerk Auth](https://clerk.dev)
- [Redis Upstash](https://upstash.com)

## Run Locally

Clone the project

```bash
git clone https://github.com/DamianKocjan/flashcardz
```

Go to the project directory

```bash
cd flashcardz
```

Install dependencies

```bash
npm install
```

Set environment variables

- copy contents of `.env-example` to `.env`
- fill variables

Start the server

```bash
npm run dev
```

## Testing

- Create testing account in development enviroment on Clerk's dashboard. With data which you used to create user update `auth.json` file in `cypress/fixtures/`.
- Update `.env` file.
- Run `npm run seed`.

### Running integration tests

```bash
npm run test
```

### Running end-to-end (e2e) tests

```bash
npm run cypress:run
```

## Authors

- [Damian Kocjan](https://www.github.com/DamianKocjan)
- [Kacper Gumieniak](https://www.github.com/Foorty7even)

## License

[MIT](https://github.com/DamianKocjan/flashcardz/blob/main/LICENSE)
