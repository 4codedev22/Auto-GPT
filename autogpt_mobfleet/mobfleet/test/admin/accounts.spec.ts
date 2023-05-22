import axios from 'axios';
import { beforeAllTests, baseUrl, config, afterAllTests, loginUrl } from './default';

const url = `${baseUrl}/accounts`;
describe('Accounts', () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });
    it('should create user', async () => {
        try {
            const user = {
                name: `${+new Date()} - Should Create User`,
                email: `${+new Date()} - Should Create User@4code.dev`,
                passwordDigest: process.env.PASS,
                cellPhone: '66989894433',
                displayLanguage: 'pt-br',
                roles: ['admin'],
            };
            const response = await axios.post(`${baseUrl}/accounts`, user, config);
            expect(response.status).toBe(201);
        } catch (error) {
            console.error(error);
        }
    });

    it('should authenticate with new user', async () => {
        const credential = {
            username: process.env.EMAIL,
            password: process.env.PASS,
        };
        try {
            const response = await axios.post(loginUrl, credential);
            expect(response.data.id_token).toBeDefined();
        } catch (error) {
            fail();
        }
    });
    it('should list all accounts', async () => {
        const response = await axios.get(`${url}`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toBeGreaterThan(0);
    });
});
