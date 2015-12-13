# Reverb.js

**Reverb.js** is a Web Audio API extension for creating reverb nodes with a dedicated impulse-response reverb library. You can quickly load any of the provided impulse responses or use your own. This project and the associated impulse responses are provided under the [Attribution Share Alike Creative Commons](http://creativecommons.org/licenses/by-sa/3.0/) license.

The Web Audio API does not specifically include a reverb node type. Instead, it has something better: a *convolution node*! Convolution is a mathematical transformation that combines an impulse response and a dry signal to yield a wet signal. Reverberation is easy to model with impulse responses since most reverberation has a linear response (contains little distortion). Impulse responses for simulating reverberation are often generated by recording a percussive noise or frequency sweep in a space. Does this all sound convoluted? Well, technically, it is!

## Usage
Assuming ``audioContext`` was the name of the variable containing the reference to the AudioContext, first call:

```
reverbjs.extend(audioContext);
```

This will add two functions to the audio context:

```
audioContext.createReverbFromBase64(audioBase64, callback) -> AudioNode
audioContext.createReverbFromUrl(audioUrl, callback) -> AudioNode
```

These act like any of the other ``audioContext.create...()`` functions, and each immediately returns a new node (of the ConvolverNode type) and asynchronously attempts to fetch and/or decode the given impulse response into the convolver node's ``buffer``, calling the optional ``callback`` after it has successfully loaded.

The ``audioContext.createReverbFromBase64`` function accepts a Base64 string representation of the audio file (without newlines). The characters allowable by the Base64 decoder are A-Z, a-z, 0-9, +, /, and =. Base64 is useful for embedding the impulse response into your JavaScript (for local testing, resource consolidation, etc.).

Alternatively, you can use the ``audioContext.createReverbFromUrl`` to load the impulse response from any URL.

For the best cross-platform performance, use **16-bit, 2 channel (stereo), 44.1KHz** **WAV** (uncompressed) or **M4A** (AAC compressed) impulse responses. As of late 2015, there is universal support for both WAV and M4A in all major browsers, so the choice to use WAV or M4A mostly depends on whether fidelity or size is most important. Keep in mind that audio codecs are primarily designed to compress sound, speech, and music—not impulse responses. Depending on the nature of the impulse response, compression may result in a noticeable change in the *color* of reverberation.