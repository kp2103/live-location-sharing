import { watchPositionId } from "./Geolocation.js"

const stopSharingLocation = document.getElementById('stop-sharing')

console.log(stopSharingLocation)
function handleStopSharingLocation()
{
    console.log("stop sharing location is called")
    navigator.geolocation.clearWatch(watchPositionId)
}

stopSharingLocation.addEventListener('click',handleStopSharingLocation)