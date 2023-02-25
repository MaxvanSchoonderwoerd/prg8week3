const synth = window.speechSynthesis;

const video = document.getElementById("webcam");

const label = document.getElementById("label");
const phoneConfidenceElement = document.getElementById("confidence");
const bar = document.getElementById("bar");

const label2 = document.getElementById("label2");
const emptyConfidenceElement = document.getElementById("confidence2");
const bar2 = document.getElementById("bar2");

const featureExtractor = ml5.featureExtractor("MobileNet");
const classifier = featureExtractor.classification(video);
featureExtractor.load("/model/model.json", modelLoaded);
let phoneConfidence;
let emptyConfidence;

const sentences = {
  100: "hihahihahihihahihahihahuehuehuehuehuehuehuuuuuuuuu huuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuua my gahwd je hebt gewoon 100 procent man doe normaal AAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHH",
  90: "Goed gedaan dat is het goede object",
  75: "Bijna goed",
  50: "Ik denk niet dat dit het goede object is",
  30: "Je zit hier niet in de buurt",
  10: "Nee dit is fout",
};
// When the model is loaded
function modelLoaded() {
  console.log("Model Loaded!");
  setInterval(() => classify(), 100);
  setInterval(() => speak(), 10000);
}

function getConfidence(callback) {
  classifier.classify(video, (err, result) => {
    if (result[0].label == "Phone") {
      phoneConfidence = (result[0].confidence * 100).toFixed(2);
      emptyConfidence = (result[1].confidence * 100).toFixed(2);
    } else {
      phoneConfidence = (result[1].confidence * 100).toFixed(2);
      emptyConfidence = (result[0].confidence * 100).toFixed(2);
    }
    callback(phoneConfidence, emptyConfidence);
  });
}

function speak() {
  const sentenceIndex = parseFloat(phoneConfidence).toFixed(0);
  let largestKey = 10;

  for (const key in sentences) {
    if (sentenceIndex >= key && key > largestKey) {
      largestKey = key;
    }
  }

  const utterThis = new SpeechSynthesisUtterance(sentences[100]);
  // synth.speak(utterThis);
}

function classify() {
  getConfidence((phoneConfidence, emptyConfidence) => {
    phoneConfidenceElement.innerHTML = `${phoneConfidence}%`;
    bar.value = phoneConfidence;

    emptyConfidenceElement.innerHTML = `${emptyConfidence}%`;
    bar2.value = emptyConfidence;
  });
}

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.log(err);
    });
}
