import yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

import { Logger } from '@nestjs/common';
const logger = new Logger('Config');

export class Config {
    debugLogging = 'debug';
    'server.port' = '8081';
    'mobfleet.clientApp.name' = 'mobfleet';
    'mobfleet.registry.password' = 'admin';
    'mobfleet.security.authentication.jwt.hash-salt-or-rounds' = 10; 
    'mobfleet.mail.base-url' = 'http://127.0.0.1:${server.port}';
    'mobfleet.mail.from' = 'mobfleet@localhost';
    'mobfleet.swagger.default-include-pattern' = '/v2/.*';
    'mobfleet.swagger.title' = 'mobfleet API';
    'mobfleet.swagger.description' = 'mobfleet API documentation';
    'mobfleet.swagger.version' = '1.2.3';
    'mobfleet.swagger.path' = '/v2/v2/api-docs';


    constructor(properties) {
        this.addAll(properties);
    }

    public get(key: string): any {
        return this[key];
    }

    public addAll(properties): any {
        properties = objectToArray(properties);
        for (const property in properties) {
            if (properties.hasOwnProperty(property)) {
                this[property] = properties[property];
            }
        }
        this.postProcess();
    }

    public postProcess(): any {
        const variables = { ...this, ...process.env };
        for (const property in this) {
            if (this.hasOwnProperty(property)) {
                const value = this[property];
                const processedValue = this.processTemplate(value, variables);
                this[property] = processedValue;
            }
        }
    }

    private processTemplate(template, variables): any {
        if (typeof template === 'string') {
            return template.replace(
                new RegExp('\\${[^{]+}', 'g'),
                name => variables[name.substring(2, name.length - 1)],
            );
        }
        return template;
    }

    public getClientPath(): string {
        return path.join(__dirname, '../swagger-ui');
    }
}

const yamlConfigPath = path.join(__dirname, 'config', 'application.yml');
const envYamlConfigPath = path.join(__dirname, 'config', `application-${process.env.BACKEND_ENV}.yml`);

const yamlConfig = yaml.load(fs.readFileSync(yamlConfigPath, 'utf8'));
logger.log(`Actual process.env.BACKEND_ENV value: ${process.env.BACKEND_ENV}`);
logger.log('Standard allowed values are: dev, test or prod');
logger.log(`if you run with a non standard BACKEND_ENV value, remember to add your application-${process.env.BACKEND_ENV}.yml file`);
if (!fs.existsSync(envYamlConfigPath)) {
    logger.error(
        `An application-${process.env.BACKEND_ENV}.yml file with your process.env.BACKEND_ENV value does not exist under config folder!`,
    );
}
const envYamlConfig = yaml.load(fs.readFileSync(envYamlConfigPath, 'utf8'));

const config = new Config({ ...objectToArray(yamlConfig), ...objectToArray(envYamlConfig), ipAddress: ipAddress() });

export { config };

function objectToArray(source, currentKey?, target?): any {
    target = target || {};
    for (const property in source) {
        if (source.hasOwnProperty(property)) {
            const newKey = currentKey ? currentKey + '.' + property : property;
            const newVal = source[property];

            if (typeof newVal === 'object') {
                objectToArray(newVal, newKey, target);
            } else {
                target[newKey] = newVal;
            }
        }
    }
    return target;
}

function ipAddress(): any {
    const interfaces = require('os').networkInterfaces();
    for (const dev in interfaces) {
        if (interfaces.hasOwnProperty(dev)) {
            const iface = interfaces[dev];
            for (const alias of iface) {
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    return null;
}
