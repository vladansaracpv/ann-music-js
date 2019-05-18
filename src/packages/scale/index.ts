const loadScale = (fileURL: string, callback) => {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', fileURL, true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == 200) {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
};

interface Scale {
  intervals: string[];
}
const parseScale = sheet => {
  const dict = {};
  for (const key in sheet) {
    if (sheet.hasOwnProperty(key)) {
      const element = { intervals: sheet[key][0], names: sheet[key][1] || [] };
      dict[key] = element.intervals;

      element.names.forEach(name => {
        dict[name] = element.intervals;
      });
    }
  }
  console.log(Object.keys(dict).length);
  console.log(Object.keys(sheet).length);
};

export const start = () => {
  loadScale('../src/packages/scale/scales.json', response => {
    const scales = JSON.parse(response);
    parseScale(scales);
  });
};
