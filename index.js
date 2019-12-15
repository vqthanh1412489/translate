var fs = require('fs');
var axios = require('axios');

const sourceLanguage = 'en'
const targetLanguage = 'es'
const URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
const API_KEY = 'trnsl.1.1.20191214T065700Z.1cab4e9aa8591e7a.f0cb85202143e87bebd47969cb47dd5894a32b9a'

var obj;

fs.readFile('./source/en.json', 'utf8', function (err, data) {
if (err) throw err;
obj = JSON.parse(data);
let parmas = new URLSearchParams();
Object.keys(obj).forEach(ele => {
    parmas.append('text', obj[ele])
})
parmas.append("key", API_KEY)
parmas.append("lang",`${sourceLanguage}-${targetLanguage}`)

    axios.get(URL, {
        params: parmas,
      })
      .then(function (response) {
          if (response.data.code === 200){
            fs.writeFile(`./target/${targetLanguage}.json`, '{\n', function(err) {
                if(err) {
                    return console.log(err);
                }
            });
            const length = response.data.text.length;
            for (let i = 0; i < length; i ++){
                fs.appendFile(`./target/${targetLanguage}.json`, `\t"${Object.keys(obj)[i]}": "${response.data.text[i]}",\n`, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                });
            }

            setTimeout(() => {
                fs.appendFile(`./target/${targetLanguage}.json`, `}`, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
            }, 3000)
          }
      })
      .catch(function (error) {
        console.log(error);
      });
  
});