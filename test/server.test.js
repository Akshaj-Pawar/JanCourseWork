const request = require('supertest');
const app = require('../app');

describe('Test the colour quiz service', () => {

    test ('GET /api/data/q_data/questiontext succeeds', () => {
        return request (app)
        .get('/api/data/q_data/questiontext')
        .expect(200);
    });
    //index being out of bounds is a client side issue


    test ('GET /api/data/q_data/optiontext succeeds', () => {
        return request (app)
        .get('/api/data/q_data/optiontext?option=A&index=2')
        .expect(200);
    });
    test ('GET /api/data/q_data/optiontext 2A succeeds', () => {
        return request (app)
        .get('/api/data/q_data/optiontext?option=A&index=2')
        .expect(/heart/)
    });
    test ('GET /api/data/q_data/optiontext 4E succeeds', () => {
        return request (app)
        .get('/api/data/q_data/optiontext?option=E&index=4')
        .expect(/zombie/);
    });
    test ('GET /api/data/q_data/optiontext bad index fails', () => {
        return request (app)
        .get('/api/data/q_data/optiontext?option=A&index=20')
        .then(response => {
            expect(response.body).toEqual({})
        })
    });
    test ('GET /api/data/q_data/optiontext bad option fails', () => {
        return request (app)
        .get('/api/data/q_data/optiontext?option=X&index=2')
        .expect(500);
    });


    test ('GET /api/data/q_data/score', () => {
        return request (app)
        .get('/api/data/q_data/score?index=2&ans=A&attributekey=Warmth')
        .expect(200);
    });
    test ('GET /api/data/q_data/score valid 2AW', () => {
        return request (app)
        .get('/api/data/q_data/score?index=2&ans=A&attributekey=Warmth')
        .expect(/3/);
    });
    test ('GET /api/data/q_data/score valid 3CG', () => {
        return request (app)
        .get('/api/data/q_data/score?index=3&ans=C&attributekey=Grace')
        .expect(/2/);
    });
    test ('GET /api/data/q_data/score invalid ans', () => {
        return request (app)
        .get('/api/data/q_data/score?index=2&ans=X&attributekey=Warmth')
        .expect(500);
    });
    test ('GET /api/data/q_data/score invalid key', () => {
        return request (app)
        .get('/api/data/q_data/score?index=2&ans=A&attributekey=Xarmth')
        .expect(500);
    });
    test ('GET /api/data/q_data/score invalid index', () => {
        return request (app)
        .get('/api/data/q_data/score?index=20&ans=A&attributekey=Warmth')
        .then(response => {
            expect(response.body).toEqual({})
        })
    });


    test ('GET /api/final succeeds', () => {
        return request (app)
        .get('/api/final?colour=Crimson')
        .expect(200);
    });
    test ('GET /api/final?colour=Crimson is valid', async () => {
        return request (app)
        .get('/api/final?colour=Crimson')
        .expect('Content-Type', /json/)
        .expect(/Crimson: /);
    });
    test ('GET /api/final?colour=Verdant is valid', async () => {
        return request (app)
        .get('/api/final?colour=Verdant')
        .expect('Content-Type', /json/)
        .expect(/Verdant: /)
        .expect(/ravages of life/);
    });
    test ('GET /api/final bad colour fails', () => {
        return request (app)
        .get('/api/fina?colour=octarine')
        .expect(404);
    });


    test ('GET /api/data/a_data/colour_list succeeds', () => {
        return request (app)
        .get('/api/data/a_data/colour_list')
        .expect(200);
    });
    test ('GET /api/data/a_data/colour_list returns valid list', async () => {
        const response = await request (app)
        .get('/api/data/a_data/colour_list')
        .expect('Content-Type', /json/);
        
        expect(response.body).toContain('Crimson');
        expect(response.body).toContain('Cerulean');
    });


    test ('GET /api/data/a_data/picture_list?colour=Crimson succeeds', () => {
        return request (app)
        .get('/api/data/a_data/picture_list?colour=Crimson')
        .expect(200);
    });
    test ('GET /api/data/a_data/picture_list?colour=Tyrian is JSON', () => {
        return request (app)
        .get('/api/data/a_data/picture_list?colour=Tyrian')
        .expect(200)
        .expect('Content-Type', /json/);
    });


    test('POST /api/data/a_data/add_picture succeeds', async () => {
        const testData = {
            image_url: "https://images.unsplash.com/photo-1568561300108-e0c35b5f7c1c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            selected_colour: "Crimson"
        };
        const response = await request(app)
        .post('/api/data/a_data/add_picture')
        .send(testData)
        .expect(200)
        .expect('Content-Type', /json/);
    });
    test('POST /api/data/a_data/add_picture missing field', async () => {
        const response = await request(app)
        .post('/api/data/a_data/add_picture')
        .send({})  
        .expect(500);
    });
})