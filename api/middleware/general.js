const nodemailer = require("nodemailer");
var ejs = require("ejs");

module.exports.dateTime = (UNIX_timestamp) => {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
};

module.exports.sendMail = async (
  to,
  title,
  body,
  from = "FillyJobs noreply@fillyjobs.com"
) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jd4010859@gmail.com",
      pass: "ijdpngbvqalupyfm",
    },
  });
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {

      // console.log('Server is ready to take messages', success);
    }
  });
  ejs.renderFile("./api/template/welcome_mail.ejs",body, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var mainOptions = {
        from,
        to,
        subject: title,
        html: data,
      };
      // console.log("html data ======================>", mainOptions.html);
      transporter.sendMail(mainOptions, function (error, info) {
        if (error) {
          console.log(error);
          return {
            error: true,
            message: "Error: Receipt not Sent",
            err: error,
          };
        } else {
          console.log(info);
          return {
            message: "Receipt Sent Successfully",
            error: false,
            data: info,
          };
        }
      });
    }
  });
};
