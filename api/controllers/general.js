exports.sendMail = (req, res, next) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sydney.torkornoo@gmail.com",
      pass: "mtuubwcghmeubtud",
    },
  });
  function timeConverter(UNIX_timestamp) {
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
  }

  var mailOptions = {
    from: "Kwanso User Dashboard sydney.torkornoo@gmail.com",
    to: orders.orderBy.email,
    subject: "Receipt for Order with code " + orders._id,
    html: `Order Code - ${
      orders._id
    } <br />    Order Placed on - ${timeConverter(
      orders.createdAt
    )}<br />    Order Total - ${orders.orderTotal}<br />    Order Status - ${
      orders.orderStatus
    }<br />    ----------------------------------------------------<br />    Product Details<br />    ----------------------------------------------------<br />    Product Name - ${
      orders.productId.title
    }<br />    Price per Unit - ${(
      orders.orderTotal / orders.orderQuantity
    ).toFixed(2)}<br />    <br /><br /><br /><br />    Powered by Fillyjobs`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(409).json({
        error: true,
        message: "Error: Receipt not Sent",
        error,
      });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(201).json({
        message: "Receipt Sent Successfully",
        data: info.response,
      });
    }
  });
};
