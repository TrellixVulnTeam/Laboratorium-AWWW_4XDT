const myFunctions = {};

/* PART 0 */
/* Nothing to be done here. Only understand the function f0 and get familiar with promises. */
function f0() {
  // We omit the reject parameter in the promise. We do not use it
  const promise0 = new Promise((resolve) => {
    setTimeout(() => {
      resolve('A message delivered after few seconds');
    }, 5000);
  });
  console.log('Getting a message... (please wait)');
  promise0.then((resultMessage) => {
    console.log(`Here is the message: ${resultMessage}`);
  });
  console.log('Some other stuff');
}
f0();

/* PART 1 */
/* Nothing to change here in promise1 */
// We omit the reject parameter in the promise. We do not use it
myFunctions.promise1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('You have finished part 1!');
  }, 2000);
});

/* PART 2 */
/* Nothing to change here in promise2a */
// We omit the reject parameter in the promise. We do not use it
const promise2a = new Promise((resolve) => {
  setTimeout(() => {
    resolve('You have');
  }, 2000);
});
/* Nothing to change here in promise2b */
// We omit the reject parameter in the promise. We do not use it
const promise2b = new Promise((resolve) => {
  setTimeout(() => {
    resolve('finished part 2!');
  }, 1000);
});

myFunctions.functionPart2 = () => {
  const value1 = promise2a;
  const value2 = promise2b;
  return Promise.all([value1, value2]);
};

/* PART 3 */
myFunctions.functionPart3 = (word) => {
  console.log(`Call to functionPart3 with word: ${word}`);
  return new Promise((resolve, reject) => {
      if (word.endsWith('123')) {
          resolve('Good word');
      } else {
          reject('Bad word');
      }
  })
};

module.exports = myFunctions;
