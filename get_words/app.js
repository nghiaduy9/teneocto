const rp = require('request-promise');
const fs = require('fs')

let output = []
let j = 0
let n = 0
while(n<86800){
  const url = 'http://www.wordcount.org/dbquery.php?toFind='+n+'&method=SEARCH_BY_INDEX'
  rp(url)
  .then($ => {
    let data = $.toString()
    let arr = data.split("&")      
    for(i=4;i<arr.length;i+=2){
      let each = {
        "index": ++j,
        "word": arr[i].split("=")[1],
        "freg": arr[i+1].split("=")[1]
      }
      output.push(each)
    }
    fs.writeFile("data.json", JSON.stringify(output), (err) => {
      if (err) throw err
    })
  })
  .catch(err => {
    console.error(err)
  })
  n+=301
}


