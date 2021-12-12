//compiled with LiveServer extension - have to open with some NodeJS

//get xml file location
let xmlLocation = "../XML/orderD700827038_1.xml";

var downloadButton = document.getElementById("button");
document.body.style.textAlign = "center";
downloadButton.onclick = function (event) {
  downloadFile();
};

//get xml file using html Node server
const response = await fetch(xmlLocation);
const body = await response.text();
let parser = new DOMParser(),
  xmlDoc = parser.parseFromString(body, "text/xml");
let Header = xmlDoc.getElementsByTagName("Header");
let Items = xmlDoc.getElementsByTagName("Items");

//prepare csv
var csvFileData = [["Order Header", ""]];
csvFileData.push(["----", "----"]);

//check for children and push func
function checkForChildrenAndPush(arr) {
  arr.forEach((element, _index) => {
    if (element.children.length === 0)
      csvFileData.push([element.tagName, element.innerHTML]);
    else {
      csvFileData.push([""]);
      csvFileData.push([
        element.tagName === "Item" ? element.tagName + _index : element.tagName,
        "----",
      ]);
      csvFileData.push([""]);
      checkForChildrenAndPush([...element.children]);
    }
  });
}

//push order header
var headerArr = [...Header[0].children];
checkForChildrenAndPush(headerArr);

//push order Body
var itemsArr = [...Items[0].children];
checkForChildrenAndPush(itemsArr);

//making the csv
let csv = csvFileData.map((e) => e.join(",")).join("\n");

//prepare for download
function downloadFile() {
  var encodedUri = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "order-D700827038_1.csv");
  document.body.appendChild(link);
  link.click();
}
