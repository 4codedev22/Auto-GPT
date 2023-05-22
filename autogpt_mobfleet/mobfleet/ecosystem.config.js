module.exports = {
    apps: [{
        name: 'mobfleet-nodejs',
        script: './bundle.js',
        watch: false,
        listen_timeout: 10000,
        exec_interpreter: '/home/ubuntu/.nvm/versions/node/v14.21.2/bin/node'
    }],
};
