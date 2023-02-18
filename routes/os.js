
const express = require('express');
const router = express.Router();
const os = require('os');

router.get('/', function(req, res, next) {
  const osInfo = {
    hostname: os.hostname(),
    type: os.type(),
    platform: os.platform()
  };
  res.json(osInfo);
});

module.exports = router;