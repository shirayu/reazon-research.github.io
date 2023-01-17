const DURATION = 5000;
const API_ENDPOINT = 'https:///asr.ceptord.net/api/transcribe';

var ReazonSpeechDemo = {
    init: function() {
        this.$button = document.querySelector('#demo-button');
        this.$message = document.querySelector('#demo-message');
        this.buffer = null;
        this.mediaRecorder = null;
        this.$button.addEventListener('click', () => {
            this.onClick();
        });
    },

    createMediaRecoder: function(stream) {
        var mediaRecorder = new MediaRecorder(stream, {mimeType:  'audio/webm'});
        mediaRecorder.ondataavailable = (e) => {
            this.buffer.push(e.data);
        };
        mediaRecorder.onstop = (e) => {
            stream.getTracks()[0].stop();
            this.request();
        };
        return mediaRecorder;
    },

    onClick: function() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            this.$button.innerText = '録音中（5秒間）...';
            this.$message.innerText = '';
            this.buffer = [];

            this.mediaRecorder = this.createMediaRecoder(stream);
            this.mediaRecorder.start();

            setTimeout(() => {
                this.mediaRecorder.stop();
                this.$button.innerText = '音声認識を試す';
                this.$message.innerText = '推論中です ...';
            }, DURATION);
        });
    },

    request: function() {
        var formData = new FormData()
        var blob = new Blob(this.buffer);
        formData.append('audio', blob);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', API_ENDPOINT, true)
        xhr.onreadystatechange = () => {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
              var resp = JSON.parse(xhr.response);
              if (resp.text) {
                  this.$message.innerText = resp.text;
              }
            }
          }
        }
        xhr.send(formData);
    },
}

window.addEventListener('DOMContentLoaded', () => {
    ReazonSpeechDemo.init();
});
