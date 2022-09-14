const Chat = require("../models/Chat");
const User = require("../models/User");
const Cryptr = require("cryptr");
const { sendMail } = require("../middleware/general");
const cryptr = new Cryptr("e7b75a472b65bc4a42e7b3f78833a4d00040beba79");

// Create
exports.addChat = async (req, res, next) => {
  const { from, to, message } = req.body;
  try {
    const msg = await Chat.create({ sender: from, users: [from, to], message });
    if (msg) {
      if (!onlineUsers.has(to)) {
        try {
          const _from = await User.findOne({ _id: from });
          const _to = await User.findOne({ _id: to });
          console.log(onlineUsers)
          console.log(_from)
          let name = _from.type === "agency" ? _from.title : _from.name
          let link =
            "https://fillyjobs.vercel.app/me/messenger/" +
            cryptr.encrypt(_from.phone);
        sendMail(_to.email, `You have a new message from ${name}`.toUpperCase(), {
          name: _to.type === "agency" ? _to.title : _to.name,
          title: "New Message Notification!!!",
          content:
            `${name} has sent you a message .\b\n\b\n Click on the following link to view the message(s)`,
          label: "View Message",
          link,
        });
        } catch (e) {
          console.log('err', e)
        }}
      return res.status(201).json({
        msg,
        message: "Message sent successfully",
      });
    }
    return res.status(403).json({
      error: true,
      err: null,
      message: "Sending message failed",
    });
  } catch (e) {
    return res.status(403).json({
      error: true,
      err: e,
      message: "Sending message failed",
    });
  }
};

// Reads
exports.getChat = async (req, res, next) => {
  // console.log(req.headers.admin)
  try {
    const messages = await Chat.find({
      users: {
        $all: [req.headers.user, req.body.user],
      },
    }).sort({ updatedAt: 1 });
    if (messages)
      return res.status(201).json({
        message: "All messages",
        messages,
      });
    return res.status(201).json({
      message: "No messages found",
      error: true,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Fetching messages failed",
      error: true,
      err,
    });
  }
};

// Update

exports.updateChat = (req, res, next) => {
  let ret = req.body;
  delete ret.admin;
  delete ret.iat;
  delete ret.exp;
  console.log(req.params);
  console.log(ret);
  // return
  Chat.findOneAndUpdate(
    { _id: req.params.id },
    ret,
    { new: true },
    function (err, doc) {
      if (err) {
        console.error("err", err);
        return res.status(500).json({ error: err });
      } else {
        console.log(doc);
        return res.status(201).json({
          message: "Chat Updated Successfully",
          category: doc,
        });
      }
    }
  );
};
