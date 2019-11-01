
const Subscribtion = require('./model/subscribtion')
const push = require('web-push')

const sendNotification = (username,sender)=>{
    Subscribtion.aggregate([
        {
            $match:{username}
        },
        // {
        //     $addFields:{"subscription.expirationTime":null}
        // }
    ]).then(userToken =>{
        const payload = JSON.stringify({title:"New Message",body:`from ${sender}`})
        
         console.log(userToken[0])
         const sub = {
            endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABduv5TUVXBzZpIZ99AwXwCNfp_WF6R-N9ElgjtBXGC6SeKZeuTllPif1J2PJk2KG6tsQRCEw0Lbnkc8eM0kI-2PI9sEi5eh-SXlS2U2xnj5URc8SPnXpbNv8sJgGuOchmxA9oS4rIzB_p4i1bUIaKMtJaYtRBFQc09l6qgvw7-TWZJqY8',
            keys: {
              auth: 'hQKJHbYflQE86NACPSlxDQ',
              p256dh: 'BHzYNFNP0QxOlTwLUkgnX1F_KWVnnhZYsSpemhsuTkiKSreSeGqCcyg8E6Ivkm14Ic4wVmMt-8AKN9mTFOulKuM'
            },
            expirationTime: null
          }
        console.log(userToken[0].subscription)
        return push.sendNotification(userToken[0].subscription,payload)
    }).then(()=>console.log("notification send"))
    .catch(err=>console.log(err))
}

module.exports = sendNotification;