var fs = require('fs');
var path = require('path');
var getPixels = require('get-pixels');

module.exports = function getPixelsFromFolder(folder){
  var allFiles = fs.readdirSync(folder); //Get all files in folder

  function isFilePicture(p){
    var ext = p.slice((p.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif';
  }

  var files = allFiles.filter(isFilePicture); // Filter files to get pictures

  function getPixelPromise(path, type) { // Make getPixels into a promise
    type = type || null;
    return new Promise(function(resolve, reject) {
      getPixels(path, type, function(error, data){
        if (!error) {
          resolve(data);
        } else {
          reject(error);
        }
      })
    });
  }

  var pictureArr = files.map(function(file) { // Map through all pictures and get pixels
    return getPixelPromise(folder + "/" + file).then((res, rej) => {
      return {
        path: folder,
        name: file,
        width: res.shape.slice()[0],
        height: res.shape.slice()[1],
      }
    }).catch((err) => console.log(err));
  });

  return Promise.all(pictureArr)
    .catch((err) => console.log(err));
}
