import axios from 'axios';

import { afterAllTests, baseUrl, beforeAllTests, config, getUserById, userID } from './default';

const url = `${baseUrl}/vehicle-groups`;
describe('VehicleGroup', () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });

    const newVehicleGroup = () => ({
        name: `vehicleGroup-${+new Date()}`,
    });

    const createVehicleGroup = async () => {
        const vehicleResponse = await axios.post(`${url}`, newVehicleGroup(), config);
        expect(vehicleResponse.status).toBe(201);
        return vehicleResponse.data;
    };

    const deleteVehicleGroup = async id => {
        const vehicleDeleteResponse = await axios.delete(`${url}/${id}`, config);
        expect(vehicleDeleteResponse.status).toBe(204);
    };

    it('should create one VehicleGroup', async () => {
        const v = await createVehicleGroup();
        const response = await axios.get(`${url}/${v.id}`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBe(v.id);
    });

    it('should list all VehicleGroups', async () => {
        const v = await createVehicleGroup();
        const v1 = await createVehicleGroup();
        const v2 = await createVehicleGroup();

        const response = await axios.get(`${url}/?sort=vehicleGroup.id,ASC`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toBeGreaterThanOrEqual(3);

        await deleteVehicleGroup(v.id);
        await deleteVehicleGroup(v1.id);
        await deleteVehicleGroup(v2.id);
    });

    it('should get 1 from VehicleGroup', async () => {
        const v = await createVehicleGroup();
        const v1 = await createVehicleGroup();
        const v2 = await createVehicleGroup();
        const user = await getUserById(userID);

        const response = await axios.get(
            `${url}?page=0&size=1&sort=vehicleGroup.id,ASC&contractID=${user.contracts[0].id}`,
            config,
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toEqual(1);
        expect(response.headers['x-total-count']).toBeDefined();

        await deleteVehicleGroup(v.id);
        await deleteVehicleGroup(v1.id);
        await deleteVehicleGroup(v2.id);
    });

    it('should get 1 from VehicleGroup without sort', async () => {
        const v = await createVehicleGroup();
        const v1 = await createVehicleGroup();
        const v2 = await createVehicleGroup();
        const user = await getUserById(userID);

        const response = await axios.get(`${url}?page=0&size=1&contractID=${user.contracts[0].id}`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toEqual(1);
        expect(response.headers['x-total-count']).toBeDefined();

        await deleteVehicleGroup(v.id);
        await deleteVehicleGroup(v1.id);
        await deleteVehicleGroup(v2.id);
    });

    it('should get 1 from VehicleGroup with search', async () => {
        const v = await createVehicleGroup();
        const user = await getUserById(userID);

        const response = await axios.get(
            `${url}?page=0&size=10&search=${v.name}&contractID=${user.contracts[0].id}`,
            config,
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toEqual(1);
        expect(response.headers['x-total-count']).toBeDefined();

        await deleteVehicleGroup(v.id);
    });
});
