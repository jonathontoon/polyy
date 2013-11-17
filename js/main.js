/*

  Javascript by Jonathon Toon

  >>jonathontoon.com<<

  This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Give where credit is due. 

*/

var canvas, 
    ctx, 
    buffer, 
    screenWidth, 
    screenHeight,
    canvasHeight = 500,
    canvasWidth = 500;  

var triangleSize = 20, 
    count = 0;

var imageHeight, 
    imageWidth,
    imageRatio;

window.onload = function(){ 

  screenWidth = 500,
  screenHeight = 500;

  var container = document.getElementById('container'); 
  container.width = screenWidth,
  container.height = screenHeight;

  canvas = document.getElementById('canvas'); 
  
  if(canvas.getContext){
    ctx = canvas.getContext('2d');
    
    document.getElementById('selectedImage').onchange = handleFileSelect;

  } else {
    alert("Canvas not supported!");
  }

};

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    for (var i = 0, f; f = files[i]; i++) {

      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
            
          createShape(e.target.result);

        };
      })(f);

      reader.readAsDataURL(f);
    }
  }
            
function createShape(data){

  var img = new Image();
      img.src = data;

      img.onload = function(){
        
        imageHeight = img.height;
        imageWidth = img.width;
        imageRatio = img.width / img.height;

        canvas.width = 500,
        canvas.height = 500;

        var memory = document.createElement('canvas');
        memory.width = 500,
        memory.height = 500;

        buffer = memory.getContext('2d'); 

        var scaledHeight = imageHeight * (500/imageWidth);
        var scaledWidth = imageWidth * (500/imageHeight);
        
        if(imageWidth > imageHeight){
          buffer.drawImage(img, (scaledWidth-500)/2*-1, 0, scaledWidth, 500); 
        } else {
          buffer.drawImage(img, 0, (scaledWidth-500)/2, 500, scaledHeight);  
        } 

        var data = buffer.getImageData(0,0,500,500).data; 
        ctx.lineCap = 'round';
        ctx.webkitImageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        ctx.imageSmoothingEnabled = true;
        ctx.save();

        
        drawMask('square');
        
        for(var y = 0; y < imageHeight; y+=triangleSize) {
          
          for(var x = 0; x < imageWidth; x+=triangleSize) {
            
            createTriangle(new Array(x+triangleSize/2, y+triangleSize/2), new Array(x+triangleSize, y), new Array(x+triangleSize, y+triangleSize), x, y, data);
            createTriangle(new Array(x+triangleSize/2, y+triangleSize/2), new Array(x+triangleSize, y+triangleSize), new Array(x, y+triangleSize), x, y, data);
            createTriangle(new Array(x, y), new Array(x+triangleSize/2, y+triangleSize/2), new Array(x+triangleSize, y), x, y, data);
            createTriangle(new Array(x, y), new Array(x+triangleSize/2, y+triangleSize/2), new Array(x, y+triangleSize), x, y, data);

            count++;
          }
        }

        ctx.restore();

      }

}

function drawMask(shape){
  
  var size = 240,
      Xcenter = 250,
      Ycenter = 250;

  ctx.beginPath();

  if(shape == 'diamond'){
    
    ctx.moveTo(Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
   
    for (var i = 1; i <= 4;i += 1) {
        ctx.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / 4), Ycenter + size * Math.sin(i * 2 * Math.PI / 4));
    }

  } else {

    ctx.rect(0,0,499,499);

  }
  
 
  ctx.clip();

}

function createTriangle(v1, v2, v3, x, y, data) {

  var cenX = Math.round((v1[0] + v2[0] + v3[0]) / 3);
  var cenY = Math.round((v1[1] + v2[1] + v3[1]) / 3);

  var daa = buffer.getImageData(cenX, cenY, 1, 1).data;

  var red = daa[0];
  var green = daa[1];
  var blue = daa[2];
  var c = 'rgb('+red+','+green+','+blue+')';

  ctx.beginPath();
  ctx.moveTo(v1[0], v1[1]);
  ctx.lineTo(v2[0], v2[1]);
  ctx.lineTo(v3[0], v3[1]);
  ctx.lineTo(v1[0], v1[1]);
  ctx.fillStyle = c;
  ctx.fill();
  ctx.strokeStyle = c;
  ctx.stroke();
  ctx.closePath();
}

