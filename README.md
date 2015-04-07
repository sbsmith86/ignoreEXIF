# ignoreEXIF
JS script that removes EXIF data from a file so that it can be easily ignored. For example, if you want to work with and display images taken on a phone, EXIF data will rotate and orient the photo on the device in ways that aren't true to the actual file, making it hard to manipulate the photo. This can only be used on browsers that support [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). Check out the [example](http://sbsmith86.github.io/ignoreEXIF/example/) on a phone to see it in action!

# Usage

1) Add jQuery and the IgnoreEXIF.min.js script to your page: 
```
<script src="../node_modules/jquery/dist/jquery.js"></script>
<script src="../dist/IgnoreEXIF.min.js"></script>
```

2) Use the script by passing it a File Reader object. This will return a file blob you can use to create an image url to work with the file:
```
$("input").on("change", function(event) {
  event.preventDefault();

  var files = !!this.files ? this.files : [];

  // Test for FileReader support
  if (!files.length || !window.FileReader) {
    return;
  }

  var fr = new FileReader();
  
  fr.readAsArrayBuffer(this.files[0]);
  fr.onload = function () {
    // Call the IgnoreExif script that generates a blob stripped of EXIF data.
    var blob = IgnoreExif.generateBlob(this.result);
    
    // Create an image url with that file blob.
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    
    // You can now use that image url to work with and display the image.
  };
});
```

