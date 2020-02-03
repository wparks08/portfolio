const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const bucketName = process.env.s3bucket;

module.exports = {
    upload: function(key, body) {
        let params = {
            Bucket: bucketName,
            Key: key,
            Body: body
        };

        s3.putObject(params, (err, data) => {
            return err ? err : data;
        });
    },

    download: function(key) {
        let params = {
            Bucket: bucketName,
            Key: key
        };

        return new Promise((resolve, reject) => {
            s3.getObject(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
};
