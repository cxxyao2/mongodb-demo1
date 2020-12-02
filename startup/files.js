const express = require("express");
const fs = require("fs");
const bodyParser = require('body-parser');
// const multer = require('multer');

module.exports = function (app) {
  
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