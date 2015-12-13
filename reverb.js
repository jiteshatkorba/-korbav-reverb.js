/*global ArrayBuffer, Uint8Array, window, XMLHttpRequest*/
var reverbjs = {
  extend : function (audioContext) {
    function decodeBase64ToArrayBuffer(input) {
      function encodedValue(input, index) {
        var encodedCharacter, x = input.charCodeAt(index);
        if (index < input.length) {
          if (x >= 65 && x <= 90) {
            encodedCharacter = x - 65;
          } else if (x >= 97 && x <= 122) {
            encodedCharacter = x - 71;
          } else if (x >= 48 && x <= 57) {
            encodedCharacter = x + 4;
          } else if (x === 43) {
            encodedCharacter = 62;
          } else if (x === 47) {
            encodedCharacter = 63;
          } else if (x !== 61) {
            console.log('base64 encountered unexpected character code: ' + x);
          }
        }
        return encodedCharacter;
      }

      if (input.length === 0 || (input.length % 4) > 0) {
        console.log('base64 encountered unexpected length: ' + input.length);
        return;
      }

      var padding = input.match(/[=]*$/)[0].length,
        decodedLength = input.length * 3 / 4 - padding,
        buffer = new ArrayBuffer(decodedLength),
        bufferView = new Uint8Array(buffer),
        encoded = [],
        d = 0,
        e = 0,
        i;

      while (d < decodedLength) {
        for (i = 0; i < 4; i += 1) {
          encoded[i] = encodedValue(input, e);
          e += 1;
        }
        bufferView[d] = (encoded[0] * 4) + Math.floor(encoded[1] / 16);
        d += 1;
        if (d < decodedLength) {
          bufferView[d] = ((encoded[1] % 16) * 16) + Math.floor(encoded[2] / 4);
          d += 1;
        }
        if (d < decodedLength) {
          bufferView[d] = ((encoded[2] % 4) * 64) + encoded[3];
          d += 1;
        }
      }
      return buffer;
    }

    function decodeAndSetupBuffer(node, arrayBuffer, callback) {
      audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
        node.buffer = audioBuffer;
        if (typeof callback === "function" && audioBuffer !== null) {
          callback(node);
        }
      });
    }

    audioContext.createReverbFromBase64 = function (audioBase64, callback) {
      var reverbNode = audioContext.createConvolver();
      decodeAndSetupBuffer(reverbNode, decodeBase64ToArrayBuffer(audioBase64),
        callback);
      return reverbNode;
    };

    audioContext.createReverbFromUrl = function (audioUrl, callback) {
      var reverbNode = audioContext.createConvolver(),
        request = new XMLHttpRequest();
      request.open('GET', audioUrl, true);
      request.responseType = 'arraybuffer';
      request.onload = function () {
        decodeAndSetupBuffer(reverbNode, request.response, callback);
      };
      request.send();
      return reverbNode;
    };
  }
};
