import axios from 'axios';

import { afterAllTests, baseUrl, beforeAllTests, config, userID, getUserById } from './default';

const url = `${baseUrl}/vehicles`;
describe('Vehicle', () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });
    it('should list all vehicles with contract', async () => {
        const v = await createVehicle();
        const v1 = await createVehicle();
        const v2 = await createVehicle();

        const user = await getUserById(userID);
        const response = await axios.get(`${url}/?contractID=${user.contracts[0].id}`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.deviceBleUuid).toBeUndefined();
        expect(response.data.length).toBe(3);

        await deleteVehicle(v.id);
        await deleteVehicle(v1.id);
        await deleteVehicle(v2.id);
    });

    it('should list all vehicles without contract', async () => {
        jest.setTimeout(10000);
        const v = await createVehicle();
        const v1 = await createVehicle();
        const v2 = await createVehicle();
        const response = await axios.get(`${url}/`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.deviceBleUuid).toBeUndefined();
        expect(response.data.length).toBeGreaterThan(0);
        await deleteVehicle(v.id);
        await deleteVehicle(v1.id);
        await deleteVehicle(v2.id);
    });

    it('should get 1 from vehicles', async () => {
        const user = await getUserById(userID);
        const v = await createVehicle();
        const response = await axios.get(`${url}?page=0&size=1&contractID=${user.contracts[0].id}`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data[0].deviceBleUuid).toBeUndefined();
        expect(response.data.length).toEqual(1);
        expect(response.headers['x-total-count']).toBeDefined();

        await deleteVehicle(v.id);
    });

    it('should get vehicles from ID', async () => {
        const v = await createVehicle();
        const response = await axios.get(`${url}/${v.id}`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.deviceBleUuid).toBeUndefined();
        await deleteVehicle(v.id);
    });
    const newVehicle = () => ({
        chassis: `${+new Date()}`.substring(0, 12),
        licensePlate: 'BRA1S20',
        renavam: `${+new Date()}`.substring(0, 9),
        yearManufacture: 2000,
        yearModel: 2000,
        gearshift: 'MANUAL',
        typeFuel: 'GASOLINE',
        tankFuel: 500,
        fuelLevel: 500,
        color: 'RED',
        qtyPlace: 5,
        motorization: '2313123',
        defaultHotspot: 1,
        status: 'INACTIVE',
        licenseLink:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.toyshow.com.br%2Fmkp%2Fteste&psig=AOvVaw1POLoi9wlzUCbYa2EekvOu&ust=1648956685570000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMDU1b649PYCFQAAAAAdAAAAABAD',
        pictureLink:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fespeciais.g1.globo.com%2Feducacao%2Fguia-de-carreiras%2F2017%2Fteste-vocacional%2F&psig=AOvVaw1POLoi9wlzUCbYa2EekvOu&ust=1648956685570000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMDU1b649PYCFQAAAAAdAAAAABAJ',
        hasKeyholder: false,
        vehicleGroup: 1,
        vehicleModel: 2,
    });

    const createVehicle = async () => {
        const vehicleResponse = await axios.post(`${url}`, newVehicle(), config);
        expect(vehicleResponse.status).toBe(201);
        return vehicleResponse.data;
    };

    const deleteVehicle = async id => {
        const vehicleDeleteResponse = await axios.delete(`${url}/${id}`, config);
        expect(vehicleDeleteResponse.status).toBe(204);
    };

    it('should create a new vehicle', async () => {
        const v = await createVehicle();
        expect(v.id).toBeDefined();
        await deleteVehicle(v.id);
    });

    it('should have at leat 1 vehicle available', async () => {
        const v = await createVehicle();
        expect(v.id).toBeDefined();
        await deleteVehicle(v.id);
    });
});
