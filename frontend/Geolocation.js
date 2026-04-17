// // const socket = io(`http://localhost:4000`);
// const socket = io(`https://live-location-sharing-1c2l.onrender.com`,{
//     transports: ['websocket']
// });

// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min
// }


// const params = new URLSearchParams(window.location.search)

// // by default sender does not have role
// const role = params.get('role') || 'sender';

// let roomId = params.get('room');

// if (!roomId) {
//     roomId = String(getRandomNumber(1001, 9999));

//     const newUrl = `${window.location.origin}?room=${roomId}&role=sender`;
//     window.history.replaceState({}, '', newUrl);
// } else{ roomId = roomId.trim() }

// //emiting the roomID
// socket.on("connect", () => {
//     console.log("Connected:", socket.id);
//     socket.emit('join-room', roomId);
// });

// const zoom = 18;

// let map = L.map('map').setView([51.505, -0.09], zoom);

// const popupContext = `
//         <div>
//             <h3>📍 Your Location</h3>
//             <p>Right now I am here</p>
//              <button class="btn btn-green" type="button">
//                     <i class="fa-solid fa-location-dot" style="color: #ffffff;"></i>
//                     Start Sharing
//                 </button>
//         </div>
//     `;
// let watchPositionId = null

// addTileLayer();

// let marker = L.marker([51.505, -0.09]).addTo(map).bindPopup(popupContext);

// const latEle = document.getElementById('lat')
// const lngEle = document.getElementById('lng')

// const stopSharingLocationEle = document.getElementById('stop-sharing')

// const startSharingLocationEle = document.getElementById('start-sharing')

// if(role !== 'sender')
// {
//     stopSharingLocationEle.classList.add('hidden')
//     startSharingLocationEle.classList.add('hidden')
//     document.querySelector('.tracking-panel span').innerText = 'tracking-panel'
// }

// function throttling(fn, delay) {
//     let flag = true;

//     return function () {
//         const context = this;
//         const args = arguments;
//         if (flag) {
//             flag = false;
//             fn.apply(context, args)

//             setTimeout(() => {
//                 flag = true;
//             }, delay)
//         }
//     }
// }

// const throttleLocationHandler = throttling(updateLocation, 2000);

// if (role === 'sender') {
//     watchPositionId = navigator.geolocation.watchPosition(throttleLocationHandler, (error) => {
//         console.log("Error at watchPosition", error)
//     }, { enableHighAccuracy: true })
// }

// // recive the location for the server
// socket.on('receive-location', (data) => {
//     if(role === 'sender')
//         return;

//     console.log('receive Location',data)
//     setMarker(data.lat,data.lng)
// })

// function addTileLayer() {
//     const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

//     const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

//     L.tileLayer(tileURL, {
//         maxZoom: zoom,
//         attribution: attribution
//     }).addTo(map);
// }

// function setMarker(lat, lng) {
//     map.setView([lat, lng], zoom)
//     marker.setLatLng([lat,lng])

//     latEle.innerText = lat.toFixed(4);
//     lngEle.innerText = lng.toFixed(4);

//     //check if sender so send the locatio
//     if (role === 'sender') {
//         sendLocation(lat,lng)
//     }
// }

// function updateLocation(position) {
//     if (position) {
//         // map.setView([position.coords.latitude, position.coords.longitude], zoom)
//         // marker.setLatLng([position.coords.latitude, position.coords.longitude])

//         // latEle.innerText = position.coords.latitude.toFixed(4);
//         // lngEle.innerText = position.coords.longitude.toFixed(4);

//         // //check if sender so send the locatio
//         // if (isSender) {
//         //     sendLocation(position.coords.latitude, position.coords.longitude)
//         // }

//         setMarker(position.coords.latitude,position.coords.longitude)
//     }
// }

// function sendLocation(lat, lng) {

//     console.log("sending data: ",{lat,lng})
//     socket.emit('send-location', {
//         roomId: roomId,
//         lat,
//         lng
//     })
// }

// // handlers

// function handleStopSharingLocation()
// {
//     if(role === 'sender')
//     {
//         console.log("stop sharing location is called")
//         navigator.geolocation.clearWatch(watchPositionId)
//         watchPositionId = null;
//         console.log("Stopped sharing");
//     }
//     else
//     {
//         alert('You can not stop location sharing , you can view only')
//     }
// }

// function handleStartSharingLocation()
// {
//     // create an link that you can share
//     const shareLink = `${window.location.origin}?room=${roomId}&role=viewer`

//     document.getElementById('share-link').innerText = shareLink

//     // copy to clipboard
//     navigator.clipboard.writeText(shareLink).then(()=>{
//         alert('✅ Share link copied to clipboard!');
//     }).catch(()=>{
//         alert("❌ Failed to copy link");
//     })
// }

// //lister
// stopSharingLocationEle.addEventListener('click',handleStopSharingLocation)

// startSharingLocationEle.addEventListener('click',handleStartSharingLocation)

// export { watchPositionId }


// * Chat GTP Code
// socket connection

const socket = io(`https://live-location-sharing-1c2l.onrender.com`, {
    transports: ['websocket']
});

// utils
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// params
const params = new URLSearchParams(window.location.search);
const role = params.get('role') || 'sender';
let roomId = params.get('room');

// generate room if not present
if (!roomId) {
    roomId = String(getRandomNumber(1001, 9999));

    const newUrl = `${window.location.origin}?room=${roomId}&role=sender`;
    window.history.replaceState({}, '', newUrl);
}else {
    roomId = String(roomId).trim();
}

// socket connection
socket.on("connect", () => {
    console.log("Connected:", socket.id);
    socket.emit('join-room', roomId);
});

socket.on("disconnect", () => {
    console.log(" Disconnected");
});

socket.on("reconnect", () => {
    console.log("Reconnected");
    socket.emit('join-room', roomId);
});

// map setup
const zoom = 18;
let map = L.map('map').setView([51.505, -0.09], zoom);

function addTileLayer() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: zoom,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
}
addTileLayer();

let marker = L.marker([51.505, -0.09]).addTo(map);

// UI
const latEle = document.getElementById('lat');
const lngEle = document.getElementById('lng');

const stopBtn = document.getElementById('stop-sharing');
const startBtn = document.getElementById('start-sharing');

if (role !== 'sender') {
    stopBtn.classList.add('hidden');
    startBtn.classList.add('hidden');
}

// throttling
function throttling(fn, delay) {
    let flag = true;
    return function (...args) {
        if (!flag) return;
        flag = false;
        fn.apply(this, args);
        setTimeout(() => flag = true, delay);
    }
}

let watchPositionId = null;

const throttleLocationHandler = throttling(updateLocation, 2000);

// sender starts tracking
if (role === 'sender') {
    startTracking();
}

function startTracking() {
    if (watchPositionId) return;

    watchPositionId = navigator.geolocation.watchPosition(
        throttleLocationHandler,
        (err) => console.log("Geolocation error:", err),
        { enableHighAccuracy: true }
    );
}

// receive location (IMPORTANT FIX)
socket.on('receive-location', (data) => {
    console.log("receiver called")
    // ignore own updates
    if (role === 'sender') return;

    console.log(" Viewer received:", data);
    setMarker(data.lat, data.lng);
});

// update marker
function setMarker(lat, lng) {
    map.setView([lat, lng], zoom);
    marker.setLatLng([lat, lng]);

    latEle.innerText = lat.toFixed(4);
    lngEle.innerText = lng.toFixed(4);
}

// sender location update
function updateLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    setMarker(lat, lng);

    if (role === 'sender') {
        sendLocation(lat, lng);
    }
}

// emit location
function sendLocation(lat, lng) {
    console.log("Sending:", { lat, lng });

    socket.emit('send-location', {
        roomId,
        lat,
        lng
    });
}

// stop sharing
stopBtn.addEventListener('click', () => {
    if (watchPositionId) {
        navigator.geolocation.clearWatch(watchPositionId);
        watchPositionId = null;
        console.log(" Stopped sharing");
    }
});

// share link
startBtn.addEventListener('click', () => {
    const shareLink = `${window.location.origin}?room=${roomId}&role=viewer`;

    document.getElementById('share-link').innerText = shareLink;

    navigator.clipboard.writeText(shareLink)
        .then(() => alert('✅ Link copied'))
        .catch(() => alert('❌ Copy failed'));
});