import axios from 'axios'

const notification = async(username)=>{
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
    });
    console.log(register)
    //register.showNotification('hellow redwan')
    console.log("Service Worker Registered...");
    const publicKey = 'BEXR9kZ9no82gAb_FXeZLwDBKb1omIUTOU_hX1pzhswotiDEbwp3Obx_XavhpJ3vw2dzjOzfZxQGAGPYhA2KWd4'
    // Register Push
    console.log("Registering Push...");
    console.log("get sub")
    const getSub = await register.pushManager.getSubscription()
    console.log(getSub)

  if(!getSub){  

      const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:urlBase64ToUint8Array(publicKey)
          
      });
      console.log("Push Registered...");
      console.log(subscription)
    //  delete subscription.expirationTime
      axios.post("/subscribe",{subscription,username})
      .then(res=>{
          console.log(res)
      })
      .catch(err=>console.log(err))
  }

}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  export default notification