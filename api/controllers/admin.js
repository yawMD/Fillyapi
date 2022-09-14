const Admin = require("../models/Admin");
const User = require("../models/User");
const Categories = require("../models/Categories");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SubCategory = require("../models/SubCategory");
const Skill = require("../models/Skill");
const Services = require("../models/Services");
const SubService = require("../models/SubService");
const ServiceCategories = require("../models/ServiceCategories");

// Create
exports.register = (req, res, next) => {
  //   console.log(req.body);
  Admin.find({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  }).exec((err, result) => {
    if (err || result.length > 0) {
      console.log(result);
      return res.status(409).json({
        error: true,
        message:
          "Registration Failed. Account with same credentials already exists",
        err,
      });
    }
    const { name, email, password, phone } = req.body;
    bcrypt.hash(password, 10, (_err, hash) => {
      if (_err) {
        return res.status(409).json({
          error: true,
          message: "Registration Failed. Hash Error",
          err: _err,
        });
      } else {
        const _v = new Admin({
          name,
          email,
          password: hash,
          phone,
        });
        _v.save((error, user) => {
          if (error || user.length > 0) {
            return res.status(409).json({
              error: true,
              message: "Registration Failed",
              err: error,
            });
          }
          let ret = user;
          ret.password = null;
          ret.registeredOn = null;
          ret.userType = "user";
          return res.status(201).json({
            message: "Registration Successful",
            user: ret,
          });
        });
      }
    });
  });
};

exports.addCategory = (req, res, next) => {
  // console.log(req.body)
  // console.log(req.params)
  // return
  Categories.find({
    $or: [{ title: req.body.title }],
  }).exec((err, result) => {
    if (err || result.length > 0) {
      console.log(err);
      console.log(result);
      return res.status(409).json({
        error: true,
        message: "Action Failed. Category with same title already exists",
        err,
      });
    }
    const { title, image, enabled } = req.body;
    const _cat = {
      title,
      image,
      enabled,
      slug: encodeURI(
        title
          .toLowerCase()
          .replace(/\s/g, "-")
          .replace(/\?/g, "")
          .replace(/&/g, "")
          .replace(/\$/g, "")
          .replace(/\(/g, "")
          .replace(/\)/g, "")
          .replace(/[-]+/g, "-")
          .replace(/'/g, "")
          .replace(/"/g, "")
      ),
    };
    console.log(_cat);
    const _v = new Categories(_cat);
    _v.save((error, category) => {
      if (error || category.length > 0) {
        console.log(error);
        return res.status(409).json({
          error: true,
          message: "Action Failed",
          err: error,
        });
      }
      return res.status(201).json({
        message: "Action Successful",
        category,
      });
    });
  });
};

exports.addServiceCategory = (req, res, next) => {
  // console.log(req.body)
  // console.log(req.params)
  // return
  const { title } = req.body;
  const slug = encodeURI(
    title
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/\?/g, "")
      .replace(/&/g, "")
      .replace(/\$/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/[-]+/g, "-")
      .replace(/'/g, "")
      .replace(/"/g, "")
  );
  const _cat = {
    title,
    slug,
  };
  ServiceCategories.find({
    $or: [{ slug }],
  }).exec((err, result) => {
    if (err || result.length > 0) {
      console.log(err);
      console.log(result);
      return res.status(409).json({
        error: true,
        message:
          "Action Failed. Service Category with same title already exists",
        err,
      });
    }
    const _v = new ServiceCategories(_cat);
    _v.save((error, category) => {
      if (error || category.length > 0) {
        console.log(error);
        return res.status(409).json({
          error: true,
          message: "Action Failed",
          err: error,
        });
      }
      return res.status(201).json({
        message: "Action Successful",
        serviceCategory: category,
      });
    });
  });
};

exports.addService = (req, res, next) => {
  // console.log(req.body)
  // console.log(req.params)
  // return
  Services.find({
    $or: [{ title: req.body.title }],
  }).exec((err, result) => {
    if (err || result.length > 0) {
      console.log(result);
      return res.status(409).json({
        error: true,
        message: "Action Failed. Service with same title already exists",
        err,
      });
    }
    const { title, image, enabled } = req.body;
    const _cat = {
      title,
      image,
      enabled,
      slug: encodeURI(
        title
          .toLowerCase()
          .replace(/\s/g, "-")
          .replace(/\?/g, "")
          .replace(/&/g, "")
          .replace(/\$/g, "")
          .replace(/\(/g, "")
          .replace(/\)/g, "")
          .replace(/[-]+/g, "-")
          .replace(/'/g, "")
          .replace(/"/g, "")
      ),
    };
    console.log(_cat);
    const _v = new Services(_cat);
    _v.save((error, service) => {
      if (error || service.length > 0) {
        return res.status(409).json({
          error: true,
          message: "Action Failed",
          err: error,
        });
      }
      return res.status(201).json({
        message: "Action Successful",
        service,
      });
    });
  });
};

exports.addSubCategory = (req, res, next) => {
  // console.log(req.body)
  // console.log(req.params)
  // return
  const { title, category } = req.body;
  const _cat = {
    title,
    category,
    slug: encodeURI(
      title
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/\?/g, "")
        .replace(/&/g, "")
        .replace(/\$/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/[-]+/g, "-")
    ),
  };
  console.log(_cat);
  SubCategory.find({ slug: req.body.slug, category: req.body.category }).exec(
    (err, result) => {
      if (err || result.length > 0) {
        console.log(result);
        return res.status(409).json({
          error: true,
          message:
            "Action Failed. Subcategory in Category with same titles already exists",
          err,
        });
      }
      const _v = new SubCategory(_cat);
      _v.save((error, subcategory) => {
        if (error || subcategory.length > 0) {
          return res.status(409).json({
            error: true,
            message: "Action Failed",
            err: error,
          });
        }
        return res.status(201).json({
          message: "Action Successful",
          subcategory,
        });
      });
    }
  );
};

exports.addSubService = (req, res, next) => {
  // console.log(req.body)
  // console.log(req.params)
  // return
  const { title, service } = req.body;
  const _cat = {
    title,
    service,
    slug: encodeURI(
      title
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/\?/g, "")
        .replace(/&/g, "")
        .replace(/\$/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/[-]+/g, "-")
    ),
  };
  console.log(_cat);
  SubService.find({ slug: req.body.slug, service: req.body.service }).exec(
    (err, result) => {
      if (err || result.length > 0) {
        console.log(result);
        return res.status(409).json({
          error: true,
          message:
            "Action Failed. Subservice in Service with same titles already exists",
          err,
        });
      }
      const _v = new SubService(_cat);
      _v.save((error, subservice) => {
        if (error || subservice.length > 0) {
          return res.status(409).json({
            error: true,
            message: "Action Failed",
            err: error,
          });
        }
        return res.status(201).json({
          message: "Action Successful",
          subservice,
        });
      });
    }
  );
};

exports.addSkill = (req, res, next) => {
  // console.log(req.body)
  // console.log(req.params)
  // return
  const { title, category } = req.body;
  const _cat = {
    title,
    category,
    slug: encodeURI(
      title
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/\?/g, "")
        .replace(/&/g, "")
        .replace(/\$/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/[-]+/g, "-")
    ),
  };
  console.log(_cat);
  Skill.find({ slug: req.body.slug, category: req.body.category }).exec(
    (err, result) => {
      if (err || result.length > 0) {
        console.log(result);
        return res.status(409).json({
          error: true,
          message:
            "Action Failed. Skill in Category with same titles already exists",
          err,
        });
      }
      const _v = new Skill(_cat);
      _v.save((error, skill) => {
        if (error || skill.length > 0) {
          return res.status(409).json({
            error: true,
            message: "Action Failed",
            err: error,
          });
        }
        return res.status(201).json({
          message: "Action Successful",
          skill,
        });
      });
    }
  );
};

// Reads
exports.login = (req, res, next) => {
  // const { name, email, password, business, type, phone } = req.body
  // console.log({ name, email, password, business, type, phone })
  // console.log(req.body);
  // return
  const { email, password } = req.body;
  Admin.find({
    email,
  }).exec((err, user) => {
    if (err || !user) {
      console.log("err", { err, user });
      return res.status(409).json({
        error: true,
        message: "Login Failed.",
        err,
        user,
      });
    }

    if (user.length < 1) {
      console.log("no users", { user });
      return res.status(404).json({
        error: true,
        message: "Login Failed",
        err,
      });
    }
    bcrypt.compare(password, user[0].password, function (err, result) {
      if (err || !result) {
        console.log("bcrypt", { err, result });
        return res.status(422).json({
          error: true,
          message: "Login Failed",
          err: err,
        });
      }
      let ret = user[0]._doc;
      ret.type = "admin";
      ret.password = null;
      ret.registeredOn = null;
      let _ret = {
        ...ret,
        type: "admin",
        password: null,
        registeredOn: null,
      };
      console.log(_ret);
      return res.status(201).json({
        message: "Login Successful",
        data: {
          token: jwt.sign({ user: ret }, "KWanso for F1llyJ0b2 the app good.", {
            expiresIn: "1d",
          }),
        },
      });
    });
  });
};

exports.checkAuth = (req, res, next) => {
  Admin.find().exec((err, user) => {
    if (err) {
      console.log("err", { err, user });
      return res.status(409).json({
        error: true,
        message: "Auth Failed.",
        err,
        user,
      });
    }

    if (user.length > 0) {
      return res.status(404).json({
        error: true,
        new: false,
        user,
        message: "Auth Failed",
        err,
      });
    } else {
      return res.status(201).json({
        new: true,
        message: "Auth Failed",
      });
    }
  });
};

exports.users = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err || !users) {
      console.log("err", { err, users });
      return res.status(409).json({
        error: true,
        message: "Error Fetching Users.",
        err,
      });
    }

    if (users.length < 1) {
      console.log("no users", { users });
      return res.status(404).json({
        error: true,
        message: "0 Registered Users Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Registered Users",
      users,
    });
  });
};

exports.getCategories = (req, res, next) => {
  // console.log(req.headers.admin)
  Categories.find({}).exec((err, categories) => {
    if (err || !categories) {
      return res.status(409).json({
        error: true,
        message: "No Categories Found",
        err,
      });
    }

    if (categories.length < 1) {
      console.log(categories);
      return res.status(404).json({
        error: true,
        message: "No Categories Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Categories",
      categories,
    });
  });
};

exports.getServiceCategories = (req, res, next) => {
  // console.log(req.headers.admin)
  ServiceCategories.find({}).exec((err, categories) => {
    if (err || !categories) {
      return res.status(409).json({
        error: true,
        message: "No Service Categories Found",
        err,
      });
    }

    if (categories.length < 1) {
      console.log(categories);
      return res.status(404).json({
        error: true,
        message: "No Service Categories Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Service Categories",
      servicecategories: categories,
    });
  });
};

exports.getCategory = (req, res, next) => {
  // console.log(req.params.id);
  SubCategory.find({ category: req.params.id }).exec((err, categories) => {
    Skill.find({ category: req.params.id }).exec((_err, skills) => {
      if (_err && err) {
        return res.status(409).json({
          error: true,
          message: "Skill and Sub-categories Not Found",
          err: { err, _err },
        });
      }

      if (
        !skills ||
        !categories ||
        (skills.length < 1 && categories.length < 1)
      ) {
        console.log(skills, categories);
        return res.status(404).json({
          error: true,
          message: "No Skills and Sub-categories Found",
          err: { err, _err },
        });
      }

      return res.status(201).json({
        message: "All Skills and Sub-Categories",
        skills,
        categories,
      });
    });
  });
};

exports.getServices = (req, res, next) => {
  // console.log(req.headers.admin)
  Services.find({}).exec((err, services) => {
    if (err || !services) {
      return res.status(409).json({
        error: true,
        message: "No Services Found",
        err,
      });
    }

    if (services.length < 1) {
      console.log(services);
      return res.status(404).json({
        error: true,
        message: "No Services Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Services",
      services,
    });
  });
};

exports.getService = (req, res, next) => {
  // console.log(req.params.id);
  SubService.find({ service: req.params.id }).exec((err, services) => {
    if (err) {
      return res.status(409).json({
        error: true,
        message: "Skill and Sub-services Not Found",
        err,
      });
    }

    if (!services || services.length < 1) {
      console.log(services);
      return res.status(404).json({
        error: true,
        message: "No Skills and Sub-services Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Skills and Sub-Service",
      services,
    });
  });
};

exports.profile = (req, res) => {
  Profile.find({}).exec((err, users) => {
    if (err || !users) {
      console.log("err", { err, users });
      return res.status(409).json({
        error: true,
        message: "Error Fetching Profiles.",
        err,
      });
    }

    if (users.length < 1) {
      console.log("no users", { users });
      return res.status(404).json({
        error: true,
        message: "0 Registered Profiles Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Registered Profiles",
      users,
    });
  });
};

exports.messages = (req, res) => {
  Message.find({}).exec((err, messages) => {
    if (err || !messages) {
      console.log("err", { err, messages });
      return res.status(409).json({
        error: true,
        message: "Error Fetching Messages.",
        err,
      });
    }

    if (messages.length < 1) {
      console.log("no messages", { messages });
      return res.status(404).json({
        error: true,
        message: "0 Messages Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Messages",
      messages,
    });
  });
};

// Update

exports.updateCategory = (req, res, next) => {
  let ret = req.body;
  delete ret.admin;
  delete ret.iat;
  delete ret.exp;
  console.log(req.params);
  console.log(ret);
  // return
  Categories.findOneAndUpdate(
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
          message: "Category Updated Successfully",
          category: doc,
        });
      }
    }
  );
};

exports.updateService = (req, res, next) => {
  let ret = req.body;
  delete ret.admin;
  delete ret.iat;
  delete ret.exp;
  console.log(req.params);
  console.log(ret);
  // return
  Services.findOneAndUpdate(
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
          message: "Service Updated Successfully",
          service: doc,
        });
      }
    }
  );
};
