const cron = require("node-cron")

cron.schedule("*/15 * * * *", ()=>{
    console.log("Restarting server.....")
}, {
    timezone: "Asia/Ho_Chi_Minh"
})
