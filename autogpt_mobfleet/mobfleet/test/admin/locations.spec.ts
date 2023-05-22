import axios, { AxiosRequestConfig } from 'axios';
import { afterAllTests, baseUrl, beforeAllTests, config, contractID, getUserById, userID } from './default';

const url = `${baseUrl}/locations`;

const location = () => ({
    description: `Running SPEC Test ${+new Date()}`,
    address: 'Running SPEC Test ADDRESS',
    latitude: 39.603481,
    longitude: -119.682251,
    radiusM: 100,
    type: 'HOTSPOT',
    icon: 'default',
});

describe('Locations', () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });

    it('should list all locations with contract', async () => {
        try {
            const location1 = await getLocation();
            const location2 = await getLocation();
            const location3 = await getLocation();
            const user = await getUserById(userID);
            const response = await axios.get(`${url}/?page=0&contractID=${user.contracts[0].id}`, config);
            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.length).toBeGreaterThan(0);

            await delLocation(location1.id);
            await delLocation(location2.id);
            await delLocation(location3.id);
        } catch (error) {
            console.error(error);
            fail();
        }
    });

    const createCompany = async () => {
        const url = `${baseUrl}/companies`;
        const company = { name: `${+new Date()}-company` };
        await axios.post(url, company, config);
        const searchResponse = await axios.get(`${url}/?page=0&size=1&search=${company.name}`, config);
        return searchResponse.data[0];
    };

    const createContract = async () => {
        try {
            const url = `${baseUrl}/contracts`;
            const company = await createCompany();
            const contract = {
                name: `${+new Date()}-contract`,
                company: company.id,
                status: 'ACTIVE',
            };
            await axios.post(url, contract, config);
            const searchResponse = await axios.get(`${url}/?page=0&size=1&search=${contract.name}`, config);
            return searchResponse.data[0];
        } catch (error) {
            console.error(error);
        }
    };
    it('should fail to list all locations without contract if user has more than one contract', async () => {
        const contract1 = await createContract();
        const contract2 = await createContract();
        try {
            await axios.get(`${url}`, config);
        } catch (error) {
            expect(error.response.status).toBe(403);
        }
        await axios.delete(`${baseUrl}/contracts/${contract1.id}`, config);
        await axios.delete(`${baseUrl}/contracts/${contract2.id}`, config);
        await axios.delete(`${baseUrl}/companies/${contract1.company.id}`, config);
    });

    it('should get first 3', async () => {
        const user = await getUserById(userID);

        const location1 = await getLocation();
        const location2 = await getLocation();
        const location3 = await getLocation();

        const response = await axios.get(
            `${url}?page=0&size=3&sort=location.id,asc&contractID=${user.contracts[0].id}`,
            config,
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toBe(3);

        await delLocation(location1.id);
        await delLocation(location2.id);
        await delLocation(location3.id);
    });

    it('should filter by description', async () => {
        const user = await getUserById(userID);
        const response = await axios.get(
            `${url}?page=0&size=3&sort=location.id,asc&search=Running SPEC Test&contractID=${user.contracts[0].id}`,
            config,
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });

    it('should get first 2', async () => {
        const user = await getUserById(userID);
        const location1 = await getLocation();
        const location2 = await getLocation();

        const response = await axios.get(
            `${url}?page=0&size=2&sort=location.id,asc&contractID=${user.contracts[0].id}`,
            config,
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toEqual(2);
        expect(response.headers['x-total-count']).toBeDefined();

        await delLocation(location1.id);
        await delLocation(location2.id);
    });

    it('should get by lat lon', async () => {
        const response = await axios.get(`${url}/-23.627754/-46.55601`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });

    const getById = async (id: string) => {
        const foundResponse = await axios.get(`${url}/${id}`, config);
        expect(foundResponse.status).toEqual(200);
        expect(foundResponse.data).toBeDefined();
        return foundResponse.data;
    };

    const getLocation = async () => {
        const response = await axios.post(`${url}/`, location(), config);
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(response.data.timezone).toEqual('America/Los_Angeles');

        return await getById(response.data.id);
    };

    const delLocation = async id => {
        const deleteResponse = await axios.delete(`${url}/${id}`, config);
        expect(deleteResponse.status).toEqual(204);
        return deleteResponse;
    };

    it('should create, search, update and delete location', async () => {
        jest.setTimeout(10000);
        const foundLocation = await getLocation();

        const upLocation = {
            description: `Updated SPEC Test ${+new Date()}`,
            address: 'Updated SPEC Test ADDRESS',
            latitude: -17.401464,
            longitude: -50.37981,
            radiusM: 47,
            type: 'INFO_POINT',
            icon: 'new icon',
        };
        // const upLocation = { ...location, latitude: -17.401464, longitude: -50.379810 };

        const updatedLocation = await axios.put(`${url}/${foundLocation.id}`, upLocation, config);

        expect(updatedLocation.data.description).toEqual(upLocation.description);
        expect(updatedLocation.data.timezone).toEqual('America/Sao_Paulo');

        const findAgain = await getById(foundLocation.id);
        expect(upLocation.description).toBe(findAgain.description);
        expect(upLocation.address).toBe(findAgain.address);
        expect(upLocation.latitude).toBe(findAgain.latitude);
        expect(upLocation.longitude).toBe(findAgain.longitude);
        expect(upLocation.radiusM).toBe(findAgain.radiusM);
        expect(upLocation.type).toBe(findAgain.type);
        expect(upLocation.icon).toBe(findAgain.icon);

        const deleteResponse = await axios.delete(`${url}/${foundLocation.id}`, config);
        expect(deleteResponse.status).toEqual(204);
    });

    it('should create, search and update worktime and delete location', async () => {
        jest.setTimeout(60000);
        const openingHours = {
            openingHoursMonday: {
                open: '06:00',
                close: '18:00',
            },
            openingHoursTuesday: {
                open: '06:00',
                close: '18:00',
            },
            openingHoursWednesday: {
                open: '06:00',
                close: '18:00',
            },
            openingHoursThursday: {
                open: '06:00',
                close: '18:00',
            },
            openingHoursFriday: {
                open: '06:00',
                close: '18:00',
            },
            openingHoursSaturday: {
                open: '06:00',
                close: '18:00',
            },
            openingHoursSunday: {
                open: '06:00',
                close: '18:00',
            },
        };

        const foundLocation = await getLocation();

        const updatedLocation = await axios.put(`${url}/updateOpeningHours/${foundLocation.id}`, openingHours, config);

        expect(updatedLocation.status).toBe(201);
        expect(updatedLocation.data.openingHoursSaturday).toMatchObject(openingHours.openingHoursSaturday);

        const loadUpdateLocation = await getById(foundLocation.id);

        expect(loadUpdateLocation.openingHoursSaturday).toMatchObject(openingHours.openingHoursSaturday);

        const deleteResponse = await axios.delete(`${url}/${foundLocation.id}`, config);
        expect(deleteResponse.status).toEqual(204);
    });
});
