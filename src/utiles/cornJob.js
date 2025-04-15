var cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionRequestModel = require("../Model/connectionRequest");
const sendEmail = require("./sendEmail.js");

cron.schedule("8 20 * * *", async () => {
  try {
    const yesterday = subDays(Date.now(), 1);
    const yestardayStart = startOfDay(yesterday);
    const yestardayEnd = endOfDay(yesterday);
    const pendingUsers = await connectionRequestModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yestardayStart,
          $lt: yestardayEnd,
        },
      })
      .populate("toUserId fromUserId");
    const listOfEmails = [
      ...new Set(pendingUsers.map((res) => res.toUserId.email)),
    ];
    console.log(listOfEmails)

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + email,
          "There are so many frined reuests pending, please login to DevTinder.in and accept or reject the reqyests."
        );
        console.log(res);
      } catch (error) {
        console.log(error.message);
      }
    }
    //   const emails = new Set( pendingUsers.toSerId.email)
  } catch (error) {
    console.log(error.message);
  }
});
