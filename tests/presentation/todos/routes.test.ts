import request from 'supertest'
import { testServer } from '../../test.server';
import { prisma } from '../../../src/data/postgres';


describe('Todo route testing', () => {

    beforeAll(async() => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async() => {
        await prisma.todo.deleteMany();
    });

    afterEach(async() => {
        await prisma.todo.deleteMany();
    });

    const todo1 = { text: 'test text 1' };
    const todo2 = { text: 'test text 2' };

    test('Should return todos api/todos', async() => {

        await prisma.todo.createMany({
            data: [ todo1, todo2 ]
        });

        const { body } = await request( testServer.app )
          .get('/api/todos')
          .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);
        expect(body[0].completedAt).toBeNull();

    });

    test('Should return a todo api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request( testServer.app )
          .get(`/api/todos/${ todo.id }`)
          .expect(200);

        expect(body).toEqual({
            id: todo.id,
            text: todo.text,
            completedAt: todo.completedAt
        });
    });

    test('Should return a 404 NotFound Error api/todos/:id', async() => {
        const todoId = 999;

        const { body } = await request( testServer.app )
          .get(`/api/todos/${ todoId }`)
          .expect(404);

        expect(body).toEqual({ error: `Todo with id ${ todoId } not found` });
    });

    test('Should return a new TODO api/todos', async() => {
        const { body } = await request( testServer.app )
          .post('/api/todos')
          .send(todo1)
          .expect(201);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null,
        });
    });

    test('Should return an error if text is not present api/todos', async() => {
        const { body } = await request( testServer.app )
          .post('/api/todos')
          .send({ })
          .expect(400);

        expect(body).toEqual({ error: 'Text property is required' });
    });

    test('Should return an error if text is empty api/todos', async() => {
        const { body } = await request( testServer.app )
          .post('/api/todos')
          .send({ text: '' })
          .expect(400);

        expect(body).toEqual({ error: 'Text property is required' });
    });

    test('Should return an error update todo api/todos/:id', async() => {
        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
          .put(`/api/todos/${ todo.id }`)
          .send({ text: 'Hola Changuito', completedAt: '2025-11-02' })
          .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: 'Hola Changuito',
            completedAt: '2025-11-02T00:00:00.000Z'
        });
    });

    test('Should return 404 if todo is not found api/todos/:id', async() => {
        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
          .put(`/api/todos/${ todo.id + 1 }`)
          .send({ text: 'Hola Changuito', completedAt: '2025-11-02' })
          .expect(404);

        expect(body).toEqual({ error: `Todo with id ${ todo.id+1 } not found` });
    });

    test('Should return an updated todo only the date api/todos/:id', async() => {
        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
          .put(`/api/todos/${ todo.id }`)
          .send({ completedAt: '2025-11-02' })
          .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: '2025-11-02T00:00:00.000Z'
        });
    });

    test('Should return an updated todo only the text api/todos/:id', async() => {
        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
          .put(`/api/todos/${ todo.id }`)
          .send({ text: 'Hola Changuito' })
          .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: 'Hola Changuito',
            completedAt: null
        });
    });

    test('Should delete a todo api/todos/:id', async() => {
        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
            .delete(`/api/todos/${ todo.id }`)
            .expect(200)

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo.text,
            completedAt: null
        })
    });

    test('Should return 404 if todo do not exist api/todos/:id', async() => {
        const todo = await prisma.todo.create({ data: todo1 })

        const { body } = await request( testServer.app )
            .delete(`/api/todos/${ todo.id + 1 }`)
            .expect(404)

        expect(body).toEqual({ error: `Todo with id ${todo.id + 1} not found` })
    });
});