const localHost = "";
const remoteHost = "";
const isLocalServer = process.env["SERVER"] === 'local';

const env = {
    HOST:localHost,
};
export default env;