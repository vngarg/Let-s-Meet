const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

// connecting to the peer server.
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/", // host URL, in case of deployment add the heroku URL here.
  port: "8080", // port on which the server is running
});

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // adding user to our stream
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    // sending messages
    let text = document.querySelector("input");

    document.querySelector("html").onkeydown = function (e) {
      if (e.which == 13 && text.value.length != 0) {
        socket.emit("message", text.value);
        text.value = "";
      }
    };

    socket.on("createMessage", (message) => {
      const element = document.createElement("li");
      element.innerHTML = `<b>user</b><br />${message}`;
      element.classList.add("message");

      document.querySelector(".messages").append(element);
      
      // auto scroll to the bottom whenever a new message is sent.
      let x = document.querySelector('.main_chat_window');
      x.scrollTop = x.scrollHeight;
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

socket.emit("join-room", ROOM_ID);

// add our stream to the new user.
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

// Add video to the stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

// Toggle Mute
const toggleMute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}

const setMuteButton = () => {
    const element = `<i class='fas fa-microphone'></i>
    <span>Mute</span>`

    document.querySelector('.main_mute_button').innerHTML = element;
}

const setUnmuteButton = () => {
    const element = `<i class='unmute fas fa-microphone-slash'></i>
    <span>Mute</span>`

    document.querySelector('.main_mute_button').innerHTML = element;
}

// Toggle Video
const toggleVideo = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setPlayVideoButton();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setStopVideoButton();
    }
}

const setStopVideoButton = () => {
    const element = `
    <i class='fas fa-video'></i>
    <span>Stop Video</span>`

    document.querySelector('.main_video_button').innerHTML = element;
}

const setPlayVideoButton = () => {
    const element = `
    <i class='stop fas fa-video-slash'></i>
    <span>Play Video</span>`

    document.querySelector('.main_video_button').innerHTML = element;
}