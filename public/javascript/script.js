const socket = io("/");
const videoGrid = document.getElementById("VideoGrid");

const myPeer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "5000",
});

let videoStream;
const myVideo = document.createElement("video");
myVideo.muted = true;

const peers = {};

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    videoStream = stream;
    addVideoStream(myVideo, stream);
    
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("userConnected", (userId) => {
      connectNewUser(userId, stream);
    });

    let text = document.querySelector("input");

    document.querySelector("html").onkeydown = function (e) {
      if (e.which == 13 && text.value.length != 0) {
        socket.emit("message", text.value);
        text.value = "";
      }
    };

    socket.on("createMessage", (message) => {
      const element = document.createElement("li");
      element.innerHTML = `<b>${localStorage.getItem('name')}</b><br />${message}`;
      element.classList.add("message");

      document.querySelector(".messages").append(element);

      // auto scroll to the bottom whenever a new message is sent.
      let x = document.querySelector(".chatArea");
      x.scrollTop = x.scrollHeight;
    });
  });

myPeer.on("open", (id) => {
  socket.emit("joinRoom", ROOM_ID, id);
});

function connectNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

const toggleMute = () => {
  const enabled = videoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    videoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    videoStream.getAudioTracks()[0].enabled = true;
  }
};

const toggleVideo = () => {
  let enabled = videoStream.getVideoTracks()[0].enabled;
  
  if (enabled) {
    videoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    videoStream.getVideoTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;

  document.querySelector(".muteButton").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;

  document.querySelector(".muteButton").innerHTML = html;
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;

  document.querySelector(".videoButton").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  
  document.querySelector(".videoButton").innerHTML = html;
};
