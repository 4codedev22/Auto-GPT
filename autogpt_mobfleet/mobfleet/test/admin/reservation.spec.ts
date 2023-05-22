import axios from 'axios';
import { adminTokenHeaders, afterAllTests, baseUrl, beforeAllTests, config } from './default';

const url = `${baseUrl}/reservations`;
describe('Reservation', () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });
    it('should list all reservations with contract', async () => {
        const response = await axios.get(`${url}/?contractID=1`, adminTokenHeaders);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });

    it('should list all reservations without contract', async () => {
        const response = await axios.get(`${url}`, adminTokenHeaders);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });
});
