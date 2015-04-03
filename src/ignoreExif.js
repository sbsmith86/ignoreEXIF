var IgnoreExif = (function () {
  /**
   * This function strips out EXIF data from a file and recreates a
   * FileReader Blob that we use to create the image object that is used
   * in the modal. This way we only deal with the RAW image file on both
   * mobile and desktop with out having to wory about it rendering differently
   * and causing all of our image cropping/preview logic to be wrong.
   *
   * @TODO - try moving this into a web worker to enhance performance.
   */
  var offset = 0;
  var recess = 0;
  var pieces = [];
  var i = 0;
  var generatedBlob;

  var generateBlob = function(fileReaderResult) {
    var dataView = new DataView(fileReaderResult);

    if (dataView.getUint16(offset) === 0xffd8) {
      offset   += 2;
      var app1  = dataView.getUint16(offset);
      offset   += 2;

      // This loop doing the acutal reading of the data
      // and creating an array with only the pieces we want.
      while (offset < dataView.byteLength) {
        if (app1 === 0xffe1) {
          pieces[i] = {
            recess : recess,
            offset : offset - 2
          };

          recess = offset + dataView.getUint16(offset);

          i++;
        }
        else if (app1 === 0xffda) {
          break;
        }

        offset   += dataView.getUint16(offset);
        app1  = dataView.getUint16(offset);
        offset   += 2;
      }

      // If the file had EXIF data and it was removed,
      // create a file blob with using the new array of file data.
      if (pieces.length > 0) {
        var newPieces = [];

        pieces.forEach(function(v) {
          newPieces.push(fileReaderResult.slice(v.recess, v.offset));
        }, this);

        newPieces.push(fileReaderResult.slice(recess));

        generatedBlob = new Blob(newPieces, {type: "image/jpeg"});
      }
      // If no EXIF data existed on the file, then nothing was done to it.
      // We can just create a blob with the original data.
      else {
        generatedBlob = new Blob([dataView], {type: "image/jpeg"});
      }
    }
    // @TODO - If it is not a jpeg, create a png. We can work out a more
    // robust fix for this that maybe only runs through the EXIF
    // stuff if it is a jpeg in the first place.
    else {
      generatedBlob = new Blob([dataView], {type: "image/png"});
    }

    return generatedBlob;
  }

  return {
    generateBlob : generateBlob,
  }
})();
