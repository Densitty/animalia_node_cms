const path = require("path");

const uploadHelper = {
  isEmpty: function (obj) {
    return Object.keys(obj).length > 0;
  },

  isImage: function (obj) {
    return obj.mimetype.startsWith("image");
  },

  imageUploadable: function (obj) {
    const maxSize = 2097152;
    return obj.size <= maxSize;
  },

  uploadDir: path.join(__dirname, "../public/uploads"),
};

module.exports = uploadHelper;
