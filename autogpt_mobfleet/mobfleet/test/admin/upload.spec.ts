import axios, { AxiosRequestConfig } from 'axios';
import { afterAllTests, baseUrl, beforeAllTests, config } from './default';

const url = `${baseUrl}/upload`;

describe('Upload', () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });
    it('should class upload', async () => {
        const response = await axios.get(`${url}`, config);
        expect(response.status).toEqual(200);
    });
});
