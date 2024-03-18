const cron = require("node-cron")

cron.schedule("*/5 * * * *", ()=>{
    console.log("Restarting server.....")
}, {
    timezone: "Asia/Ho_Chi_Minh"
})
