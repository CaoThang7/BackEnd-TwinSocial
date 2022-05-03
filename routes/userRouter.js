const router = require('express').Router()
const auth = require("../middleware/auth")
const userCtrl = require("../controllers/userCtrl")
const multer = require('multer');
const sharp = require('sharp');
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};
const uploads = multer({
  storage, fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});

router.get('/search', auth, userCtrl.searchUser)

router.get('/user/:id', auth, userCtrl.getUser)

router.get('/getProfile', auth, userCtrl.getProfile)

router.patch('/user/update', auth, userCtrl.updateUser)

router.patch('/user/:id/follow', auth, userCtrl.follow)

router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)

router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)

router.patch(
  '/upload-profile',
  auth,
  uploads.single('profile'),
  userCtrl.uploadProfile
);

module.exports = router