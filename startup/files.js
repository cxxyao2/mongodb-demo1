
var path = require('path');
var mime = require('mime');
var fs = require('fs');


module.exports = function (app) {
    app.post('/api/file_download', function(req,res) {
      try {
        var file = process.cwd() + '/uploads/1606967665262.jpeg';

        var filename = path.basename(file);
        var mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var fileStream = fs.createReadStream(file);
        fileStream.pipe(res);
        //res.status(200).download(process.cwd() + '/uploads/givre2.jpeg','givre2.jpeg');
        // res.status(200).send('download is ok');
      } catch (error) {
         res.status(500).send(err);
      }
    });
  
  app.post('/api/files', function(req, res) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let uploadFile = req.files.myFile;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            uploadFile.mv('./uploads/' + uploadFile.name);

            //send response
            res.status(200).send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: uploadFile.name,
                    mimetype: uploadFile.mimetype,
                    size: uploadFile.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }

  });
}