const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sydney.torkornoo@gmail.com",
    pass: "mtuubwcghmeubtud",
  },
});
exports.sendMail = (subject, to, html) => {
    
    var mailOptions = {
        from: 'Kwanso Merchant Dashboard sydney.torkornoo@gmail.com',
        to: to ? to : orders.orderBy.email,
        subject: subject ? subject : 'Receipt for Order with code ' + orders._id,
        html: html ? html : `Order Code - ${orders._id} <br />
      Order Placed on - ${timeConverter(orders.createdAt)}<br />
      Order Total - ${orders.orderTotal}<br />
      Order Status - ${orders.orderStatus}<br />
      ----------------------------------------------------<br />
      Product Details<br />
      ----------------------------------------------------<br />
      Product Name - ${orders.productId.title}<br />
      Price per Unit - ${(orders.orderTotal / orders.orderQuantity).toFixed(2)}<br />
      <br /><br /><br /><br />
      Powered by Kwanso
  
      `
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
          console.log('Email sent: ' + info.response);
          return res.status(201).json({
            message: "Receipt Sent Successfully",
            data: info.response,
          });
        }
      });
};
