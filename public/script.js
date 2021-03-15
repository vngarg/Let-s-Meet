const socket = io('/');
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
myVideo.muted = true;

// connecting to the peer server.
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/', // host URL, in case of deployment add the heroku URL here.
    port: '8080', // port on which the server is running
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    audio: false, 
    video: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // adding user to our stream
    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream);
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

socket.emit('join-room', ROOM_ID);

// add our stream to the new user.
const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

// Add video to the stream
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}