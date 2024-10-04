/*
 *
 *  * Copyright (c) 2019.
 *  * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 *
 */

'use strict'

const multer = require('multer');
const multerS3 = require('multer-s3-transform')
const aws = require('aws-sdk')
let CONFIG = require('../config/config')
const sharp = require('sharp');
const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');
const s3 = new aws.S3()
aws.config.update({
  secretAccessKey: CONFIG.AWS_SECRET,
  accessKeyId: CONFIG.AWS_ACCESS,
  region: CONFIG.AWS_REGION,
});

const opcionMulter = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/static/users'))
  },
  filename: (req, file, callback) => {
    callback(null, `${moment().format('D-MM-YYYY-H-mm-ss')}-${mongoose.Types.ObjectId().toString()}.${file.originalname.split('.').pop().toString()}`)
  }
});

const serviciosMulter = multer({
  storage: multerS3({
    s3: s3,
    contentType: function (req, file, cb) {
      let type = "image/jpeg";
      if (file.mimetype === 'image/svg+xml') {
        type = 'image/png';
      }
      cb(null, type);
    },
    bucket: CONFIG.AWS_BUCKET + '/aliva/products',
    acl: 'public-read',
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [{
      id: 'original',
      key: function (req, file, cb) {
        if (file.mimetype === 'image/svg+xml' || file.mimetype === 'image/png') {
          cb(null, Date.now().toString() + '.png')
        } else {
          cb(null, Date.now().toString() + '.jpg')
        }

      },
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      transform: function (req, file, cb) {
        if (file.mimetype !== 'image/svg+xml' && file.mimetype !== 'image/png') {
          cb(null, sharp().resize(500, 500)
            .toFormat('jpeg', {
              quality: 80,
              chromaSubsampling: '4:4:4',
              force: true,
            }))
        } else {
          file.mimetype = 'image/png';
          cb(null, sharp().toFormat('png', {
            quality: 80,
            force: true,
          }))
        }
      }
    }],
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    }
  })
})

const usersCSV = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/csv'))
  },
  filename: (req, file, callback) => {
    callback(null, `${moment().format('D-MM-YYYY-H-mm-ss')}-${mongoose.Types.ObjectId().toString()}.${file.originalname.split('.').pop().toString()}`)
  }
});

const pagosMulter = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/static/facturas'))
  },
  filename: (req, file, callback) => {
    let fileName = `${moment().format('D-MM-YYYY-H-mm-ss')}-${mongoose.Types.ObjectId().toString()}.${file.originalname.split('.').pop().toString()}`

    callback(null, fileName)

  }
});

const bannerMulter = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/static/banners'))
  },
  filename: (req, file, callback) => {
    callback(null, `${moment().format('D-MM-YYYY-H-mm-ss')}-${mongoose.Types.ObjectId().toString()}.${file.originalname.split('.').pop().toString()}`)
  }
})

const configMulter = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/static/config'))
  },
  filename: (req, file, callback) => {
    callback(null, `${moment().format('D-MM-YYYY-H-mm-ss')}-${mongoose.Types.ObjectId().toString()}.${file.originalname.split('.').pop().toString()}`)
  }
})


const middlewareMultimedia = multer({storage: opcionMulter});
const middlewareServicios = serviciosMulter;
const middlewarePagos = multer({storage: pagosMulter});
const middlewareBanners = multer({storage: bannerMulter})
const middlewareUsersCSV = multer({storage: usersCSV})
const middlewareConfig = multer({storage: configMulter})

module.exports = {
  opcionMulter,
  middlewareMultimedia,
  serviciosMulter,
  middlewareServicios,
  pagosMulter,
  middlewarePagos,
  middlewareBanners,
  middlewareUsersCSV,
  middlewareConfig,
};

