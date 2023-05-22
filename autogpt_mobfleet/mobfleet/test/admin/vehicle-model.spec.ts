import axios from 'axios';

import { afterAllTests, baseUrl, beforeAllTests, config, getUserById, userID } from './default';

const url = `${baseUrl}/vehicle-models`;
const urlManufacturer = `${baseUrl}/vehicle-manufacturers`;
describe('VehicleModel', () => {
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });
    const newVehicleManufacturer = () => ({
        name: `${+new Date()}`.substring(0, 12),
    });

    const newVehicleModel = vehicleManufacturer => ({
        name: `vehicleModel-${+new Date()}`,
        type: 1,
        maintenanceKm: 10000,
        maintenanceMonths: 6,
        photos:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fespeciais.g1.globo.com%2Feducacao%2Fguia-de-carreiras%2F2017%2Fteste-vocacional%2F&psig=AOvVaw1POLoi9wlzUCbYa2EekvOu&ust=1648956685570000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMDU1b649PYCFQAAAAAdAAAAABAJ',
        vehicleManufacturer,
    });

    const createVehicleManufacturer = async () => {
        const vehicleResponse = await axios.post(`${urlManufacturer}`, newVehicleManufacturer(), config);
        expect(vehicleResponse.status).toBe(201);
        return vehicleResponse.data;
    };

    const deleteVehicleManufacturer = async id => {
        const vehicleResponse = await axios.delete(`${urlManufacturer}/${id}`, config);
        expect(vehicleResponse.status).toBe(204);
    };
    const createVehicleModel = async () => {
        const manufacturer = await createVehicleManufacturer();
        const vehicleResponse = await axios.post(`${url}`, newVehicleModel(manufacturer.id), config);
        expect(vehicleResponse.status).toBe(201);
        return vehicleResponse.data;
    };

    const deleteVehicleModel = async v => {
        const vehicleDeleteResponse = await axios.delete(`${url}/${v.id}`, config);
        expect(vehicleDeleteResponse.status).toBe(204);

        await deleteVehicleManufacturer(v.vehicleManufacturer?.id);
    };

    it('should create one vehicleModel', async () => {
        const v = await createVehicleModel();
        const response = await axios.get(`${url}/${v.id}`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBe(v.id);
    });

    it('should list all vehicleModels', async () => {
        const v = await createVehicleModel();
        const v1 = await createVehicleModel();
        const v2 = await createVehicleModel();

        const response = await axios.get(`${url}/?sort=vehicleModel.id,ASC`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toBeGreaterThanOrEqual(3);

        await deleteVehicleModel(v.id);
        await deleteVehicleModel(v1.id);
        await deleteVehicleModel(v2.id);
    });

    it('should get 1 from vehicleModel', async () => {
        const v = await createVehicleModel();
        const v1 = await createVehicleModel();
        const v2 = await createVehicleModel();
        const user = await getUserById(userID);

        const response = await axios.get(
            `${url}?page=0&size=1&sort=vehicleModel.id,ASC&contractID=${user.contracts[0].id}`,
            config,
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toEqual(1);
        expect(response.headers['x-total-count']).toBeDefined();

        await deleteVehicleModel(v.id);
        await deleteVehicleModel(v1.id);
        await deleteVehicleModel(v2.id);
    });

    it('should get 1 from vehicleModel without sort', async () => {
        const v = await createVehicleModel();
        const v1 = await createVehicleModel();
        const v2 = await createVehicleModel();
        const user = await getUserById(userID);

        const response = await axios.get(`${url}?page=0&size=1&contractID=${user.contracts[0].id}`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toEqual(1);
        expect(response.headers['x-total-count']).toBeDefined();

        await deleteVehicleModel(v.id);
        await deleteVehicleModel(v1.id);
        await deleteVehicleModel(v2.id);
    });

    it('should get 1 from vehicleModel with search', async () => {
        const v = await createVehicleModel();
        const user = await getUserById(userID);

        const response = await axios.get(
            `${url}?page=0&size=10&search=${v.name}&contractID=${user.contracts[0].id}`,
            config,
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toEqual(1);
        expect(response.headers['x-total-count']).toBeDefined();

        await deleteVehicleModel(v.id);
    });
});
