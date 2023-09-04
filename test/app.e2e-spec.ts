import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = await moduleFixture.resolve(PrismaService);
    await prisma.notes.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.cards.deleteMany();
    await prisma.user.deleteMany();
    await app.init();
  });
  const SALT = 10;

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('I’m okay!');
  });

  describe('user test =>', () => {
    it('/users/sign-up => should create user', () => {
      return request(app.getHttpServer())
        .post('/users/sign-up')
        .send({
          email: 'email@email.com',
          password: 'aBcd@123',
        })
        .expect(HttpStatus.CREATED);
    });

    it('users/sign-in => should login', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };
      await prisma.user.create({
        data: userData,
      });
      return await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' })
        .expect(HttpStatus.OK);
    });
  });

  describe('notes test =>', () => {
    it('/notes => should create note', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      return await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Note Title',
          annotation: 'text text text',
        })
        .set('Authorization', `Bearer ${token.body.token}`)
        .expect(HttpStatus.CREATED);
    });

    it('/notes => should get note', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Note Title',
          annotation: 'text text text',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/notes/:id => should get one note', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      const note = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Note Title',
          annotation: 'text text text',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .get(`/notes/${note.body.id}`)
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/notes/:id => should delete note', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      const note = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Note Title',
          annotation: 'text text text',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .delete(`/notes/${note.body.id}`)
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });
  });

  describe('credentials test =>', () => {
    it('/credentials => should create credentials', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      return await request(app.getHttpServer())
        .post('/credentials')
        .send({
          password: 'password',
          username: 'User1',
          label: 'Linkedin Account',
          url: 'linkedin.com',
        })
        .set('Authorization', `Bearer ${token.body.token}`)
        .expect(HttpStatus.CREATED);
    });

    it('/credentials => should get credentials', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      await request(app.getHttpServer())
        .post('/credentials')
        .send({
          password: 'password',
          username: 'User1',
          label: 'Linkedin Account',
          url: 'linkedin.com',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .get('/credentials')
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/credentials/:id => should get one credential', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      const credential = await request(app.getHttpServer())
        .post('/credentials')
        .send({
          password: 'password',
          username: 'User1',
          label: 'Linkedin Account',
          url: 'linkedin.com',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .get(`/credentials/${credential.body.id}`)
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/credentials/:id => should delete credential', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      const credential = await request(app.getHttpServer())
        .post('/credentials')
        .send({
          password: 'password',
          username: 'User1',
          label: 'Linkedin Account',
          url: 'linkedin.com',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .delete(`/credentials/${credential.body.id}`)
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });
  });

  describe('cards test =>', () => {
    it('/cards => should create card', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      return await request(app.getHttpServer())
        .post('/cards')
        .send({
          number: 111111111,
          name: 'User1',
          code: 111,
          date: '11/12',
          password: '1111',
          is_virtual: true,
          payment: 'both',
          label: 'card 1',
        })
        .set('Authorization', `Bearer ${token.body.token}`)
        .expect(HttpStatus.CREATED);
    });

    it('/cards => should get cards', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      await request(app.getHttpServer())
        .post('/cards')
        .send({
          number: 111111111,
          name: 'User1',
          code: 111,
          date: '11/12',
          password: '1111',
          is_virtual: true,
          payment: 'both',
          label: 'card 1',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .get('/cards')
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/cards/:id => should get one cards', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      const cards = await request(app.getHttpServer())
        .post('/cards')
        .send({
          number: 111111111,
          name: 'User1',
          code: 111,
          date: '11/12',
          password: '1111',
          is_virtual: true,
          payment: 'both',
          label: 'card 1',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .get(`/cards/${cards.body.id}`)
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });

    it('/cards/:id => should delete cards', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      const cards = await request(app.getHttpServer())
        .post('/cards')
        .send({
          number: 111111111,
          name: 'User1',
          code: 111,
          date: '11/12',
          password: '1111',
          is_virtual: true,
          payment: 'both',
          label: 'card 1',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .delete(`/cards/${cards.body.id}`)
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).not.toBe(null);
    });
  });

  describe('erase test =>', () => {
    it('/erase => should erase user data', async () => {
      const userData = {
        email: 'email@email.com',
        password: bcrypt.hashSync('aBcd@123', SALT),
      };

      await prisma.user.create({
        data: userData,
      });

      const token = await request(app.getHttpServer())
        .post('/users/sign-in')
        .send({ email: 'email@email.com', password: 'aBcd@123' });

      await request(app.getHttpServer())
        .post('/cards')
        .send({
          number: 111111111,
          name: 'User1',
          code: 111,
          date: '11/12',
          password: '1111',
          is_virtual: true,
          payment: 'both',
          label: 'card 1',
        })
        .set('Authorization', `Bearer ${token.body.token}`);

      const res = await request(app.getHttpServer())
        .post(`/erase/`)
        .send({ password: 'aBcd@123' })
        .set('Authorization', `Bearer ${token.body.token}`);

      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(res.body).not.toBe(null);
    });
  });
});
