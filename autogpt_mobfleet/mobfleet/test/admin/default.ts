import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

let token: string;
export let config: AxiosRequestConfig;
export let adminTokenHeaders: AxiosRequestConfig;
export let contractName: string;
export let companyName: string;
export let userName: string;
export let userID: string;
export let contractID: string;

export const baseUrl = process.env.V2_BASE_URL;
export const loginUrl = `${baseUrl}/authenticate`;
export const TEST_TIMEOUT = 20000;

const rand = (concat: string) => `${+new Date()}-${concat}`;

const loginWithDefaultAdminAccount = async () => {
    const loginResponse = await axios.post(loginUrl, {
        username: 'francisco.cabral@moblab.digital',
        password: process.env.PASS,
    });
    adminTokenHeaders = {
        headers: {
            authorization: `Bearer ${loginResponse.data.id_token}`,
        },
    };
};
const createUser = async () => {
    await loginWithDefaultAdminAccount();
    userName = rand('user name');
    const user = {
        name: userName,
        email: process.env.EMAIL,
        passwordDigest: process.env.PASS,
        cellPhone: '66989894433',
        displayLanguage: 'pt-br',
        roles: ['admin'],
    };
    const response = await axios.post(`${baseUrl}/accounts`, user, adminTokenHeaders);
    userID = response.data.id;
    return response;
};

const loginWithNewUser = async () => {
    const response = await axios.post(loginUrl, {
        username: process.env.EMAIL,
        password: process.env.PASS,
    });

    token = response.data.id_token;
    config = {
        headers: {
            authorization: `Bearer ${token}`,
        },
    };
};

const newCompany = () => {
    companyName = rand('company name');
    return {
        name: companyName,
    };
};

const newContract = companyID => {
    contractName = rand('contract-name');
    return {
        name: contractName,
        company: companyID,
        status: 'ACTIVE',
    };
};

const createCompany = async () => {
    const url = `${baseUrl}/companies`;
    const company = newCompany();
    await axios.post(url, company, config);
    const searchResponse = await axios.get(`${url}/?page=0&size=1&search=${company.name}`, config);
    const contract = searchResponse.data[0];
    contractID = contract.id;
    return contract;
};

const createContract = async () => {
    try {
        const url = `${baseUrl}/contracts`;
        const company = await createCompany();
        const contract = newContract(company.id);
        await axios.post(url, contract, config);
        const searchResponse = await axios.get(`${url}/?page=0&size=1&search=${contract.name}`, config);
        return searchResponse.data[0];
    } catch (error) {
        console.error(error);
    }
};

const findContractByName = async (contractName: string) => {
    const response = await axios.get(`${baseUrl}/contracts?page=0&size=1&search=${contractName}`, config);

    return response.data[0];
};

const dropAllVehiclesByContract = async contractID => {
    try {
        const vehicles = await axios.get(`${baseUrl}/vehicles?contractID=${contractID}`, config);
        const v = vehicles.data?.map(v => v.id);
        await Promise.all(v?.map(async id => await axios.delete(`${baseUrl}/vehicles/${id}`, config)));
    } catch (error) {
        console.error(error);
    }
};
export const dropCompanyAndContract = async (defaultConfig?) => {
    try {
        const contract = await findContractByName(contractName);
        await dropAllVehiclesByContract(contract.id);
        await axios.delete(`${baseUrl}/contracts/${contract.id}`, defaultConfig ?? config);
        await axios.delete(`${baseUrl}/companies/${contract.company.id}`, defaultConfig ?? config);
        return {
            contractID: contract.id,
            companyID: contract.company.id,
        };
    } catch (error) {
        console.error(error.response);
        fail(error);
    }
};

export const getUserById = async id => {
    const response = await axios.get(`${baseUrl}/accounts/${id}`, config);
    return response.data;
};

export const dropUserByUsername = async () => {
    try {
        await axios.delete(`${baseUrl}/accounts/${userID}`, adminTokenHeaders);
    } catch (error) {
        console.error(error);
    }
};

export const beforeAllTests = async () => {
    jest.setTimeout(TEST_TIMEOUT);
    await createUser();
    await loginWithNewUser();
    await createContract();
};

export const afterAllTests = async () => {
    jest.setTimeout(TEST_TIMEOUT);
    await dropCompanyAndContract(adminTokenHeaders);
    await dropUserByUsername();
};
