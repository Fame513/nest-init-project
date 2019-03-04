var s3 = require('s3');
var AWS = require('aws-sdk');
const params = {
    localDir: "docs/swagger-out",
    s3Params: {
        Bucket: "my-eos-wallet"
    }
};

function uploadDir(params) {
    var aws_access_key = 'AWS_ACCESS_KEY_ID';
    var aws_private_key = 'AWS_SECRET_ACCESS_KEY';

    checkEnvVar(aws_access_key);
    checkEnvVar(aws_private_key);

    var s3Options = {
        accessKeyId: process.env[aws_access_key],
        secretAccessKey: process.env[aws_private_key]
    };

    var client = s3.createClient({s3Client: new AWS.S3(s3Options)});
    client.s3.addExpect100Continue = function() {};
    return client.uploadDir(params);
}

function checkEnvVar(envvar) {
    if (!process.env[envvar]) {
        throw new Error('Environment \'%s\' variable is not defined.'.replace('%s', envvar));
    }
}

const uploader = uploadDir(params);

uploader.on('error', (err) => {
    console.error("unable to upload:", err.stack);
});

uploader.on('progress', () => {
    console.log("progress", uploader.progressMd5Amount,
    uploader.progressAmount, uploader.progressTotal);
});

uploader.on('end', () => {
    console.log("done uploading");
});
