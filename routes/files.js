
var path = require('path');
var mime = require('mime');
var fs = require('fs');
const express = require('express');
const router = express.Router();
const photoPathinServer = '/uploads/';


router.get('/download', function(req,res) {
  try {
    // xxx.xxx.xxxx.xxx:xxx/download?filename=....jpeg
    var file = process.cwd() + photoPathinServer + req.query.filename;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
    
  } catch (error) {
      res.status(500).send(err);
  }
});
  
  router.post('/upload', function(req, res) {
    // 一个一个客户加一个销售员只能有一条记录
    // fileName: yyyymmdd (Userid last 5 numbers)(Client 5 number) .jpeg,e,g 20210301abced.jpeg
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
            uploadFile.mv('.' + photoPathinServer + uploadFile.name);

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



module.exports = router;