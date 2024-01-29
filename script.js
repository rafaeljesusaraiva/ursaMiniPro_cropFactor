// https://forum.blackmagicdesign.com/viewtopic.php?f=2&t=114242

// 35mm sensor  36.00mm × 24.00mm

// cropFactor = (diag_35mm) / (diag_sensor)

// 4608 x 2592  4.6K 16:9         25.34 mm x 14.25 mm - crop x
// 4608 x 1920  4.6K 2.40:1       25.34 mm x 10.55 mm - crop x
// 4096 x 2304  4K 16:9           22.52 mm x 12.66 mm - crop x
// 4096 x 2160  4K DCI            22.52 mm x 11.87 mm - crop x
// 3840 x 2160  Ultra HD          21.12 mm x 11.87 mm - crop x
// 3072 x 2560  3K Anamorphic     16.89 mm x 14.07 mm - crop x
// 2048 x 1152  2K 16:9           11.26 mm x 6.33 mm - crop x
// 2048 x 1080  2K DCI            11.26 mm x 5.93 mm - crop x
// 1920 x 1080  HD                10.55 mm x 5.93 mm - crop x

// Standard crop factor for FF lenses 1.58x

const size35sensor = {
  width: 36,
  height: 24
}

const codecs_sensorSizes = {
    "4.6K 16:9": {
      width: 25.34,
      height: 14.25
    },
    "4.6K 2.40:1": {
      width: 25.34,
      height: 10.55
    },
    "4K 16:9": {
      width: 22.52,
      height: 12.66
    },
    "4K DCI": {
      width: 22.52,
      height: 11.87
    },
    "Ultra HD": {
      width: 21.12,
      height: 11.87
    },
    "3K Anamorphic": {
      width: 16.89,
      height: 14.07
    },
    "2K 16:9": {
      width: 11.26,
      height: 6.33
    },
    "2K DCI": {
      width: 11.26,
      height: 5.93
    },
    "HD": {
      width: 10.55,
      height: 5.93
    }
  };

function calculate_cropFactor(sensorsize) {
  let diag35mm = Math.sqrt(size35sensor.width*size35sensor.width+size35sensor.height*size35sensor.height);
  let diagOther = Math.sqrt(sensorsize.width*sensorsize.width+sensorsize.height*sensorsize.height);
  
  return diag35mm/diagOther;
}

let selected_lensType = document.getElementById('lensType').value;
let selected_codec = document.getElementById('codec').value;

function updateValues() {
  selected_focalDistance = document.getElementById('focalDistance').value;
  selected_lensType = document.getElementById('lensType').value;
  selected_codec = document.getElementById('codec').value;
  
  let cropFactor = 1;
  let croppedFocalDistance = selected_focalDistance;
  
  // Se lenstype == fullframe -> + sensor crop factor
  if (selected_lensType == "fullframe") {
    let sensorCrop = Math.round(calculate_cropFactor(codecs_sensorSizes["4.6K 16:9"]) * 100) / 100;
    cropFactor = cropFactor * sensorCrop;
    croppedFocalDistance = croppedFocalDistance * sensorCrop;
  }
  
  // Se codec !== 4.6k 16:9 -> + codec crop factor
  if (selected_codec != "4.6K 16:9") {
    let resultCodec = Object.entries(codecs_sensorSizes).reduce((accum, current) => {
      const [key, value] = current;
      if (key == selected_codec) {
        return [...accum, value]
      }
      return [...accum]
    }, [])[0]

    let codecCrop = Math.round(calculate_cropFactor(resultCodec) * 100) / 100;
    cropFactor = cropFactor * codecCrop;
    croppedFocalDistance = croppedFocalDistance * codecCrop;
  }
  
  document.getElementById('final_cropFactor').innerHTML = cropFactor;
  document.getElementById('final_focalDistance').innerHTML = croppedFocalDistance;
}

document.getElementById('focalDistance').onchange = (event) => updateValues();
document.getElementById('lensType').onchange = (event) => updateValues();
document.getElementById('codec').onchange = (event) => updateValues();
