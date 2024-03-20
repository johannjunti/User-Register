const createApp = require('./app')
const request = require('supertest');
const validateUsername = require("./validation/validateUsername")

const mockedValidatePassword = jest.fn(password => password.length >= 8);
const mockedValidateUsername = jest.fn(username => username.length >= 6 && username.length <= 30);

const app = createApp(mockedValidateUsername, mockedValidatePassword)

describe('given correct username and password', () => {
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(200)
    })

    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.body.userId).toBeDefined();
    })

    // test response content type?
    // test response message
    // test response user id value
    // ...
})

describe('given incorrect or missing username and password', () => {
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password'
        })
        expect(response.statusCode).toBe(400)
    })

    test('testing missing username', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(400)
    })

    test('testing missing password', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: ''
        })
        expect(response.statusCode).toBe(400)
    })

    test('testing both username and password are null', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: ''
        })
        expect(response.statusCode).toBe(400)
    })

    test('return no userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password'
        })
        expect(response.body.userId).toBeUndefined()
    })

    test('test response body is correct', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password'
        })
        expect(response.body.error).toBe("Invalid User")
    })

    test('test username requirements', async () => {
        const response = await request(app).post('/users').send({

            username: 'User',
            password: 'Password123'

        })
        expect(response.body.error).toBe("Invalid User")
    })

    // test response message
    // test that response does NOT have userId
    // test incorrect username or password according to requirements
    // test missing username or password
    // ...
})