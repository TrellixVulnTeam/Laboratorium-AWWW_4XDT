const express = require('express');

const router = express.Router();
const fsPromise = require('fs/promises');
const myFunctions = require('../myLib/myModule');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('main');
});

router.get('/part1', (req, res) => {
  myFunctions.promise1.then((message) => {
      console.log(`${message}`);
      res.render('solution', { result: message });
  });
});

router.get('/part2', (req, res) => {
  myFunctions.functionPart2().then(([message1, message2]) => {
      console.log(`${message1} ${message2}`);
      res.render('solution', { result: message1 + ' ' + message2 });
  });
});

router.get('/part3/:word', (req, res) => {
  const receivedWord = req.params.word;
  myFunctions.functionPart3(receivedWord)
      .then((message) => {
          res.render('solution', { result: message });
      })
      .catch(message => {
          res.render('solution', { result: message });
      });
});

router.get('/part4/:file', (req, res) => {
  const fileToOpen = req.params.file;

  fsPromise.open('txtFiles/' + fileToOpen, 'r').then((fileHandle) => {
      fileHandle.readFile("utf-8").then((fileContent) => {
          let firstFile;
          if (fileContent.search(',') !== -1)
              firstFile = fileContent.split(',')[0];
          else
              firstFile = fileContent.split('\r')[0];
          return firstFile;
      }).then((fileToOpen) => {
          fsPromise.open('txtFiles/' + fileToOpen, 'r').then((secondFileHandler) => {
              secondFileHandler.readFile("utf-8").then((secondFileContent) => {
                  res.render('solution', { result: secondFileContent });
              })
              secondFileHandler.close().then(() => {});
          }).catch((error) => {
              res.render('solution', { result: error });
          })
      })
      fileHandle.close().then(() => {});
  })

  // async function asyncPart4() {
  //     try {
  //         let fileHandle = await fsPromise.open('txtFiles/' + fileToOpen, 'r');
  //         const data = await fileHandle.readFile("utf-8");
  //         let firstFile;
  //         if (data.search(',') !== -1)
  //             firstFile = data.split(',')[0];
  //         else
  //             firstFile = data.split('\r')[0];
  //         await fileHandle.close();
  //         let fileHandlerSecond = await fsPromise.open('txtFiles/' + firstFile, 'r');
  //         let secondFile = await fileHandlerSecond.readFile("utf-8");
  //         await fileHandlerSecond.close();
  //         return secondFile;
  //     } catch(e) {
  //         return e;
  //     }
  // }
  // asyncPart4().then((message) => {
  //     res.render('solution', { result: message });
  // });
});

// const axios = require('axios');
// const res = require("express/lib/response");
//
// axios.get('/part1').then((response) => {console.log(response)}).catch(() => {});
//
// async function getUser() {
//     try {
//         const response = await axios.get('/user?ID=12345');
//         console.log('HELLLLLLLO' + response);
//     } catch (error) {
//         console.error(error);
//     }
// }
//
// getUser().then(() => {}).catch(() => {});

module.exports = router;
