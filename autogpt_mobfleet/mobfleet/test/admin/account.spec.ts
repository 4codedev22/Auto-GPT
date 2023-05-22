import axios, { AxiosRequestConfig } from 'axios';

const v2BaseUrl = process.env.V2_BASE_URL;
const v1BaseUrl = process.env.V1_BASE_URL;

const v2Url = `${v2BaseUrl}/account`;
const v1Url = `${v1BaseUrl}/profile`;

const loginV1Url = `${v1BaseUrl}/login`;
const loginV2Url = `${v2BaseUrl}/authenticate`;
const defaultEmail = 'francisco.cabral@moblab.digital';

const v2Data = {
    id: '1',
    email: defaultEmail,
};

const v1Data = {
    id: 1,
    name: 'Francisco Cabral',
    email: defaultEmail,
};

describe('Acount', () => {
    let v1Token: string;
    let v2Token: string;

    const email = defaultEmail;
    const password = '123456';

    beforeAll(async () => {
        const options = {
            method: 'POST',
            url: loginV1Url,
            headers: { 'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001' },
            data: `-----011000010111000001101001\r\nContent-Disposition: form-data; name="email"\r\n\r\n${email}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="password"\r\n\r\n${password}\r\n-----011000010111000001101001--\r\n`,
        } as AxiosRequestConfig;

        try {
            const response = await axios.request(options);
            v1Token = response.headers['x-api-key'];
        } catch (error) {
            throw error;
        }

        try {
            const response = await axios.post(
                loginV2Url,
                { username: email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            v2Token = response.data.id_token;
        } catch (error) {
            throw error;
        }
    });
    it('should access account info in v2 with v1 token', async () => {
        const response = await axios.get(`${v2Url}/`, {
            headers: {
                authorization: `Bearer ${v1Token}`,
            },
        });
        expect(response.status).toBe(200);
        expect(response.data.email).toEqual(v2Data.email);
    });

    it('should access account info in v1  with v1 token', async () => {
        const response = await axios.get(`${v1Url}`, {
            headers: {
                'x-api-key': v1Token,
            },
        });
        expect(response.status).toBe(200);
        expect(response.data.email).toEqual(v1Data.email);
    });

    it('should access account info in v2 with v2 token', async () => {
        const response = await axios.get(`${v2Url}/`, {
            headers: {
                authorization: `Bearer ${v2Token}`,
            },
        });
        expect(response.status).toBe(200);
        expect(response.data.email).toEqual(v2Data.email);
    });

    it('should access account info in v1  with v2 token', async () => {
        try {
            const response = await axios.get(`${v1Url}`, {
                headers: {
                    'x-api-key': v2Token,
                },
            });
            expect(response.status).toBe(200);
            expect(response.data.email).toEqual(v1Data.email);
        } catch (error) {
            fail();
        }
    });
});
