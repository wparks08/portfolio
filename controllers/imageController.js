const s3 = require("../util/awss3");

module.exports = {
    getImage: (req, res) => {
        let key = req.params.key;
        s3.download(key)
            .then(image => {
                res.writeHead(200, { "Content-Type": image.ContentType });
                res.write(image.Body, "binary");
                res.end(null, "binary");
            })
            .catch(err => {
                console.log(err, err.stack);
            });
    }
}