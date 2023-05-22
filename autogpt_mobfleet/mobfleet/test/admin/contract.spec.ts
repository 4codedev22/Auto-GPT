import axios from 'axios';

import { baseUrl, beforeAllTests, config, afterAllTests, dropCompanyAndContract } from './default';

const url = `${baseUrl}/contracts`;
const loginUrl = `${baseUrl}/authenticate`;

describe('Contract', () => {
    // let token: string;
    beforeAll(async () => {
        await beforeAllTests();
    });

    afterAll(async () => {
        await afterAllTests();
    });

    const newCompany = () => ({
        name: `Company - ${+new Date()}`,
    });

    const newContract = company => ({
        name: `Contract - ${+new Date()}`,
        company: company.id,
        status: 'ACTIVE',
    });

    const createCompany = async () => {
        const company = newCompany();
        const response = await axios.post(`${baseUrl}/companies`, company, config);
        expect(response.status).toBe(201);
        return company.name;
    };

    const findCompany = async companyName => {
        const response = await axios.get(
            `${baseUrl}/companies?page=0&size=1&sort=company.id,asc&search=${companyName}`,
            config,
        );
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toBe(1);
        return response.data[0];
    };
    const createContract = async () => {
        const companyName = await createCompany();
        const company = await findCompany(companyName);
        const contract = newContract(company);
        const response = await axios.post(`${url}/`, contract, config);
        expect(response.status).toBe(201);
        return { contractName: contract.name, companyName };
    };

    const getContractByName = async (name: string) => {
        try {
            const response = await axios.get(`${url}/?page=0&size=1&sort=contract.id,asc&search=${name}`, config);
            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.length).toBe(1);
            return response.data[0];
        } catch (error) {
            console.error(error);
        }
    };

    const updateContract = async (searched, newOne) => {
        try {
            const toUpdate = { ...searched, ...newOne };
            const response = await axios.put(`${url}/${searched.id}`, toUpdate, config);
            expect(response.status).toBe(201);
            return await getContractByName(toUpdate.name);
        } catch (error) {
            console.log(error);
        }
    };
    it('should create, update, delete and search contract', async () => {
        jest.setTimeout(60000);
        try {
            const { contractName, companyName } = await createContract();
            const searchedContract = await getContractByName(contractName);
            const updatedContract = await updateContract(searchedContract, newContract(companyName));
            let response = await axios.delete(`${url}/${updatedContract.id}`, config);
            expect(response.status).toBe(204);
            expect(response.data).toBeDefined();

            response = await axios.delete(`${baseUrl}/companies/${updatedContract.company.id}`, config);
            expect(response.status).toBe(204);
            expect(response.data).toBeDefined();
        } catch (error) {
            console.error(error);
        }
    });

    it('should list all contracts sort by id', async () => {
        const response = await axios.get(`${url}/?page=0&size=20&sort=contract.id,asc`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.length).toBeGreaterThan(0);
    });
    it('should get contract by id 1', async () => {
        const response = await axios.get(`${url}/1`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(+response.data.id).toBe(1);
    });
    it('should have uuid field for contract id 1', async () => {
        const response = await axios.get(`${url}/1`, config);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.uuid).toBeDefined();
    });
});
