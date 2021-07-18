let hInput, sInput, lInput, ctx, cvs, image1, idt;
let original_image_src
//experiment
let rInput, gInput, bInput

window.addEventListener('load', (event) => {
    image1 = document.getElementById("img-grading");
    original_image_src = image1.src;
    cvs = document.createElement('canvas');
    cvs.width = image1.width;
    cvs.height = image1.height;
    ctx = cvs.getContext('2d');
    ctx.drawImage(image1, 0, 0, cvs.width, cvs.width)

    idt = ctx.getImageData(0, 0, cvs.width, cvs.height);

    hInput = document.getElementById("h");
    sInput = document.getElementById("s");
    lInput = document.getElementById("l");

    console.log(image1.src);

    setColorFromHsl();
});



// Getter & setter for pixel value
// source: https://stackoverflow.com/questions/5867723/javascript-image-manipulation-pixel-by-pixel

// Return RGBA value of a pixel using index
function imageTransform() {
    for (i=0; i<(cvs.width * cvs.height * 4); i+=4) {
        idt.data[i] = changeHue(idt.data[i], idt.data[i+1], idt.data[i+2], parseInt(hInput.value))[0];
        idt.data[i+1] = changeHue(idt.data[i], idt.data[i+1], idt.data[i+2], parseInt(hInput.value))[1];
        idt.data[i+2] = changeHue(idt.data[i], idt.data[i+1], idt.data[i+2], parseInt(hInput.value))[2];
    }
  
    ctx.putImageData(idt, 0,0);  // 0,0 is xy coordinates
    image1.src = cvs.toDataURL();
    ctx.putImageData(o_idt,0,0); // put back original image
} 

function rgbImageTransform() {
  for (i=0; i<(cvs.width * cvs.height * 4); i+=4) {
      idt.data[i] *= rInput.value;
      idt.data[i + 1] *= gInput.value;
      idt.data[i + 2] *= bInput.value;
  }

  ctx.putImageData(idt, 0,0);  // 0,0 is xy coordinates
  image1.src = cvs.toDataURL();
  ctx.putImageData(o_idt,0,0); // put back original image
} 

function resetImage() {
  image1.src = original_image_src;
  ctx.drawImage(image1, 0, 0, cvs.width, cvs.width)
  idt = ctx.getImageData(0, 0, cvs.width, cvs.height);
}

function getPixel(imgData, index) {
  return imgData.data.slice(index*4, index*4+4) // [R,G,B,A]
}

function setPixel(imgData, index, pixelData /*[R,G,B,A]*/) {
  imgData.data.set(pixelData, index*4)
}

function setColor() {
  document.getElementById('preview').style.backgroundColor = "hsl(" + hInput.value + "," + sInput.value + "%," + lInput.value +"%)";

  setGradient(hInput, [hsl(0, sInput.value, lInput.value), hsl(60, sInput.value, lInput.value), hsl(120, sInput.value, lInput.value), hsl(180, sInput.value, lInput.value), hsl(300, sInput.value, lInput.value), hsl(360, sInput.value, lInput.value)]);
  setGradient(sInput, [hsl(hInput.value, 0, lInput.value), hsl(hInput.value, 100, lInput.value)]);
  setGradient(lInput, [hsl(hInput.value, sInput.value, 0), hsl(hInput.value, sInput.value, 50), hsl(hInput.value, sInput.value, 100)]);
}

function setValue() {
  rInput = document.getElementById("Rval")
  gInput = document.getElementById("Gval")
  bInput = document.getElementById("Bval")
}

function setColorFromHsl() {
  setColor();
}

function setHslSliders(h, s, l) {
  hInput.value = h;
  sInput.value = s;
  lInput.value = l;
}

function setGradient(el, steps) {
  gradientString = "linear-gradient(to right,";

  stepSize = 100 / (steps.length - 1);

  for(var i = 0; i < steps.length; i++) {
    gradientString +=  (i > 0 ? "," : "") + steps[i] + (i * stepSize) + "%";
  }

  el.style.backgroundImage = gradientString + ")";
}

function changeHue(r, g, b, degree) {
    var hsl = rgbToHsl(r, g, b);
    hsl[0] += degree;
    if (hsl[0] > 360) {
        hsl[0] -= 360;
    }
    else if (hsl.h < 0) {
        hsl[0] += 360;
    }
    return hslToRgb(hsl[0], hsl[1], hsl[2]);
}

/**
* Formats the given RGB values into a string that can be used in CSS
*/
function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b +")";
}

/**
* Formats the given HSL values into a string that can be used in CSS
*/
function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l +"%)";
}

/**
* Takes HSL values (H between 0 and 360, S and L each between 0 and 100) and returns the corresponding RGB values (each between 0 and 255)
* Based on pseudo-code in the W3 Color Model document (http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color)
*/
function hslToRgb(h, s, l) {
  let m1, m2, m3, r, g, b;

  h = h / 360;
  s = s / 100;
  l = l / 100;

  m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  m1 = l * 2 - m2;

  r = hueToRgb(m1, m2, h + 1/3);
  g = hueToRgb(m1, m2, h);
  b = hueToRgb(m1, m2, h - 1/3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function hueToRgb(m1, m2, h) {
    if(h < 0) {
        h = h + 1;
    } else if(h > 1) {
        h = h - 1;
    }

    if(h*6 < 1) {
        return m1 + (m2 - m1) * h * 6;
    } else if(h*2 < 1) {
        return m2;
    } else if(h*3 < 2) {
        return m1 + (m2 - m1) * (2/3 - h) * 6
    }

    return m1;
}

/**
* Takes RGB values (each between 0 and 255) and returns the corresponding HSL values (H between 0 and 360, S and L each between 0 and 100).
* Based on http://stackoverflow.com/a/9493060
*/
function rgbToHsl(r, g, b) {
  let max, min, h, s, l;

  r = r / 255;
  g = g / 255;
  b = b / 255;

  max = Math.max(r, g, b);
  min = Math.min(r, g, b);

  l = (min + max) / 2;

  diff = max - min;

  if (diff == 0) {
    s = 0;
    h = 0;
  } else {
    if(l > 0.5) {
      s = (diff) / (2 - min - max)
    } else {
      s = diff / (max + min)
    }

    switch(max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
      }
    }

  return [Math.round(h * 60), Math.round(s * 100), Math.round(l * 100)];
}

//
