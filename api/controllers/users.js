const User = require("../models/User");
const Message = require("../models/Message");
// const Profile = require("../models/Profile");
const Categories = require("../models/Categories");
const ServiceCategories = require("../models/ServiceCategories");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SubCategory = require("../models/SubCategory");
const Skill = require("../models/Skill");
const Job = require("../models/Job");
const Education = require("../models/Education");
const Application = require("../models/Application");
const Work = require("../models/Work");
const Interview = require("../models/Interview");
const Services = require("../models/Services");
const ServiceEntry = require("../models/ServiceEntry");
const SubService = require("../models/SubService");
const Project = require("../models/Project");
const Employee = require("../models/Employee");
const { sendMail } = require("../middleware/general");
const Billing = require("../models/Billing");

// Create
exports.register = (req, res, next) => {
  console.log(req.body);
  // return;
  const { name, email, password, phone, type, country } = req.body;
  const status = type;
  let _d = { name, email, password, phone, type, status, country };
  User.find({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  }).exec((err, result) => {
    if (err) {
      console.log(err);
      return res.status(409).json({
        error: true,
        message: "Registration Failed. Please try again",
        err,
      });
    }
    if (result.length > 0) {
      // console.log(result);
      return res.status(409).json({
        error: true,
        message:
          "Registration Failed. Account with same credentials already exists",
      });
    }
    // return;
    bcrypt.hash(password, 10, (_err, hash) => {
      if (_err) {
        return res.status(409).json({
          error: true,
          message: "Registration Failed. Hash Error",
          err: _err,
        });
      } else {
        _d.password = hash;
        const _v = new User(_d);
        _v.save((error, user) => {
          if (error || user.length === 0) {
            console.log({ error, user });
            return res.status(409).json({
              error: true,
              message: "Registration Failed",
              err: error,
            });
          }
          let link = `https://fillyjobs.com/activate/${jwt.sign(
            email,
            user.password + user.email
          )}`;
          console.log(link);
          sendMail(email, `Registration Successful: Activate your account`, {
            name,
            title: "Congratulations!!!",
            content:
              "Welcome to FIllyJobs. Your account has been successfully created.\b\n Click on the following link to verify your email",
            label: "Verify Email Account",
            link,
          });
          let ret = user;
          ret.password = null;
          ret.registeredOn = null;
          return res.status(201).json({
            message: "Registration Successful",
            user: ret,
          });
        });
      }
    });
  });
};

exports.sendMessage = (req, res) => {
  // console.log(req.body);
  const { name, email, phone, message } = req.body;
  const _m = new Message({
    name,
    email,
    phone,
    message,
  });
  _m.save((error, msg) => {
    if (error || msg.length === 0) {
      return res.status(409).json({
        error: true,
        message: "Sending Message Failed",
        err: error,
      });
    }

    return res.status(201).json({
      message: "Message sent Successfully",
      msg,
    });
  });
};

exports.job = (req, res) => {
  // console.log(req.body);
  const { user } = req.headers;
  const {
    title,
    description,
    post_location,
    job_location,
    project_type,
    job_type,
    skills,
    category,
    budget_type,
    budget,
    skill_level,
    skill_text,
    project_length,
    weekly_hours,
  } = req.body;
  const _j = {
    title,
    slug:
      new Date().getTime() +
      "-" +
      encodeURI(
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
    description,
    post_location,
    job_location,
    project_type,
    job_type,
    skills,
    category,
    budget_type,
    budget,
    skill_level,
    skill_text,
    project_length,
    weekly_hours,
    user,
  };
  // console.log(_j);
  const _m = new Job(_j);
  _m.save((error, msg) => {
    if (error || msg.length === 0) {
      return res.status(409).json({
        error: true,
        message: "Creating Job Failed",
        err: error,
      });
    }

    return res.status(201).json({
      message: "Job Created Successfully",
      msg,
    });
  });
};

exports.addBilling = (req, res) => {
  // console.log(req.body);
  const { user } = req.headers;
  const { type, card, name, exp, code, phone, address } = req.body;
  const _j = { type, card, name, exp, phone, code, address, user };
  // console.log(_j);
  const _m = new Billing(_j);
  _m.save((error, msg) => {
    console.log(error);
    if (error || msg.length === 0) {
      return res.status(409).json({
        error: true,
        message: "Adding Payment method Failed",
        err: error,
      });
    }

    return res.status(201).json({
      message: "Payment method added",
      msg,
    });
  });
};

exports.education = (req, res) => {
  // console.log(req.body);
  const { user } = req.headers;
  const { programme, institution, from, to } = req.body;
  const _j = {
    programme,
    institution,
    from,
    to,
    user,
  };
  // console.log(_j);
  const _m = new Education(_j);
  _m.save((error, msg) => {
    if (error || msg.length === 0) {
      return res.status(409).json({
        error: true,
        message: "Creating Education Failed",
        err: error,
      });
    }

    return res.status(201).json({
      message: "Education Created Successfully",
      msg,
    });
  });
};

exports.apply = async (req, res) => {
  // console.log(req.body);
  const { user } = req.headers;
  const { job, poster } = req.params;
  const _j = {
    applicant: user,
    job,
    poster,
  };
  const __user = await User.findOne({ _id: user });
  const _poster = await User.findOne({ _id: poster });
  // console.log(_j);
  // return;
  Application.find({ applicant: user, job }).exec((err, applications) => {
    console.log(err);
    console.log(applications);
    if (err || !applications) {
      //return error
      return res.status(409).json({
        error: true,
        message: "Job Application Failed, Please Try Again",
        err: err,
      });
    } else if (applications.length > 0) {
      //return custom error
      return res.status(409).json({
        error: true,
        message:
          "You have already applied for this job. You'd be notified if you are shortlisted",
        err: err,
      });
    } else {
      const _m = new Application(_j);
      _m.save((error, application) => {
        console.log(error);
        if (error || application.length === 0) {
          return res.status(409).json({
            error: true,
            message: "Job Application Failed, Please Try Again",
            err: error,
          });
        }
        sendMail(
          __user.email,
          `Your Application has been submitted Successfully`,
          {
            name: __user.name,
            title: "Notification from Fillyjobs",
            content:
              "Your job application has been submitted to the posting agency. You will be notified if you are shortlisted for the role or an intereview is schduled with you.\n\b \n\b If you are not contacted usually within two weeks, you have not been shortlisted for the job.",
            label: "Go to your Applications",
            link: "https://fillyjobs.com/me/applications",
          }
        );
        sendMail(_poster.email, `${__user.name} Applied to your job Post`, {
          name: _poster.title,
          title: "Notification from Fillyjobs",
          content: `You've received a new application. ${__user.name} is interested in applying for your job post.\n\b \n\b View more information, schedule an interview with ${__user.name} or cancel the job post; all on your dashboard.`,
          label: "My Dashboard",
          link: "https://fillyjobs.com/me/jobs",
        });
        return res.status(201).json({
          message:
            "Job Application submitted successfully. You will be notified if you are shortlisted",
          application,
        });
      });
    }
  });
};

exports.hire = async (req, res) => {
  const {
    type,
    salary,
    commencementDate,
    terminationDate,
    terminationSet,
    paymentFrequency,
    extra,
    employer,
    employee,
    email,
    job,
  } = req.body;
  const _data = {
    type,
    salary,
    commencementDate: new Date(commencementDate).getTime(),
    terminationDate: !terminationSet ? 0 : new Date(terminationDate),
    terminationSet,
    paymentFrequency,
    extra,
    employer,
    employee,
    job,
  };

  const interview = await Interview.findOneAndUpdate({}, {});

  // console.log(_data)
  try {
    const _employee = Employee(_data);
    let ret = await _employee.save();
    console.log(ret);
    sendMail(email, `Congratulations!!!. You have a new employer`, {
      name,
      title: "Notification from Fillyjobs",
      content: `You have been hired as an employee for some jobs you applied for. \b\n\b\n\b\n Visit your dashboard to view more details on the job. Once again, congratulations`,
      label: "Go to My Jobs",
      link: "https://fillyjobs.com/me/hires",
    });
    return res.status(201).json({
      data: ret,
      message: "success",
    });
  } catch (e) {
    console.log("err", e);
    return res.status(409).json({
      error: true,
      err: e,
      message: "error",
    });
  }
};

exports.work = (req, res) => {
  // console.log(req.body);
  const { user } = req.headers;
  const { organisation, from, to, description, position, there } = req.body;
  const _j = {
    organisation,
    from,
    to,
    description,
    position,
    there,
    user,
  };
  // console.log(_j);
  const _m = new Work(_j);
  _m.save((error, msg) => {
    if (error || msg.length === 0) {
      return res.status(409).json({
        error: true,
        message: "Creating Work Failed",
        err: error,
      });
    }

    return res.status(201).json({
      message: "Work Created Successfully",
      msg,
    });
  });
};

exports.project = (req, res) => {
  // console.log(req.body);
  const { user } = req.headers;
  const { title, image } = req.body;
  const _j = {
    title,
    image,
    user,
  };
  // console.log(_j);
  const _m = new Project(_j);
  _m.save((error, msg) => {
    if (error || msg.length === 0) {
      return res.status(409).json({
        error: true,
        message: "Creating Project Failed",
        err: error,
      });
    }

    return res.status(201).json({
      message: "Project Created Successfully",
      msg,
    });
  });
};

//Read
exports.login = (req, res, next) => {
  // const { name, email, password, business, type, phone } = req.body
  // console.log({ name, email, password, business, type, phone })
  // console.log(req.body);
  // return
  const { email, password } = req.body;
  User.find({
    email,
  }).exec((err, user) => {
    // console.log("err", { err, user });
    if (err || !user) {
      return res.status(409).json({
        error: true,
        message: "Login Failed.",
        err,
        user,
      });
    }

    if (user.length < 1) {
      // console.log("no users", { user });
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
      ret.type = "user";
      ret.password = null;
      ret.registeredOn = null;
      let _ret = {
        ...ret,
        type: "user",
        password: null,
        registeredOn: null,
      };
      // console.log(_ret);
      return res.status(201).json({
        message: "Login Successful",
        data: {
          token: jwt.sign({ user: ret }, "KWanso for F1llyJ0b2 the app good.", {
            expiresIn: "1000d",
          }),
        },
      });
    });
  });
};

exports.updatePassword = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  User.find({
    _id: req.headers.user,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(300).json({
        error: true,
        message: "Password Update Failed.",
        err,
      });
    }

    if (user.length < 1) {
      return res.status(404).json({
        error: true,
        message: "Password Update Failed",
        err,
      });
    }

    if(user[0].lastPasswordChange > 0 && user[0].passwordUpdates > 3) {
      if((Date.now() - user[0].lastPasswordChange) < 1000 * 60 * 60 * 24 * 14) {
        return res.status(422).json({
          error: true,
          message: "Password Update Failed. You can attempt changing again after two weeks",
          err,
        });
      }
    }
    console.log({newPassword, oldPassword})
    bcrypt.compare(oldPassword, user[0].password, function (err, result) {
      if (err || !result) {
        console.log("bcrypt", { err, result });
        return res.status(404).json({
          error: true,
          message: "Password Update Failed",
          err: err,
        });
      }
      bcrypt.hash(newPassword, 10, (_err, hash) => {
        if (_err) {
          return res.status(422).json({
            error: true,
            message: "Password Update Failed. Hash Error",
            err: _err,
          });
        } else {
          User.findOneAndUpdate(
            { _id: req.headers.user },
            { password: hash },
            function (err, doc) {
              if (err) {
                return res.status(409).json({
                  error: true,
                  message: "Password Update Failed. Hash Error",
                  err: _err,
                });
              }
              return res.status(201).json({
                error: false,
                message: "Password Update Successful",
              });
            }
          );
        }
      });
    });
  });
};

exports.activate = (req, res, next) => {
  const { email, code } = req.body;

  User.findOne({
    email,
  }).exec((err, user) => {
    // console.log({ ...req.body });
    // console.log(user);
    // console.log("err", { err, user });
    if (err || !user || user.length < 1) {
      return res.status(409).json({
        error: true,
        message: "Verification Failed.",
        err,
      });
    }
    try {
      // console.log(code);
      data = jwt.verify(code, user.password + email);
      if (data === email) {
        console.log("success");
        User.findOneAndUpdate(
          { email },
          { verified: true },
          { new: true },
          function (err, doc) {
            if (err) {
              console.error("err", err);
              return res.status(500).json({
                error: true,
                err,
                message: "Account Verification failed",
              });
            } else {
              console.log(doc);
              return res.status(201).json({
                message: "Account Verified Successfully",
              });
            }
          }
        );
      } else {
        console.log("error");
      }
    } catch (error) {
      return res.status(403).json({
        message: "Verification Failed",
        error,
      });
    }
  });
};

exports.getCategories = (req, res, next) => {
  // console.log(req.headers.admin)
  Categories.find({ enabled: true }).exec((err, categories) => {
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
  ServiceCategories.find().exec((err, categories) => {
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
      categories,
    });
  });
};

exports.search = async (req, res) => {
  console.log(req.params);
  let query = {};
  try {
    let ret;
    switch (req.params.filter) {
      case "service-professionals":
        query = {
          type: "service",
          $or: [
            { service: { $regex: req.params.query } },
            { subservice: { $regex: req.params.query } },
            { region: { $regex: req.params.query } },
            { hometown: { $regex: req.params.query } },
            { name: { $regex: req.params.query } },
            { skill: { $regex: req.params.query } },
          ],
        };
        if (req.params.cat !== "all") query.service = req.params.cat;
        ret = await User.find(query);
        console.log(ret);
        return res.status(201).json({
          results: ret,
          type: "service",
          message: "All Results",
        });
        break;
      case "fulltime-jobs":
        query = {
          $or: [
            { job_type: { $regex: req.params.query } },
            { title: { $regex: req.params.query } },
            { slug: { $regex: req.params.query } },
            { skills: { $regex: req.params.query } },
            { description: { $regex: req.params.query } },
            { job_location: { $regex: req.params.query } },
            { category: { $regex: req.params.query } },
            { name: { $regex: req.params.query } },
            { skill_text: { $regex: req.params.query } },
          ],
        };
        if (req.params.cat !== "all") query.category = req.params.cat;
        ret = await Job.find(query).populate("user");
        console.log(ret);
        return res.status(201).json({
          results: ret,
          type: "jobs",
          message: "All Results",
        });
        break;

      default:
        break;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      err,
      message: "There was an error finding searched items",
    });
  }
};

exports.findContacts = async (req, res) => {
  console.log(req.params);
  let query = {};
  try {
    let ret;
    query = {
      $or: [
        { email: { $regex: req.params.query } },
        { phone: { $regex: req.params.query } },
      ],
    };
    ret = await User.find(query);
    console.log(ret);
    return res.status(201).json({
      contacts: ret,
      message: "All Results",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      err,
      message: "There was an error finding searched contacts",
    });
  }
};

exports.getServices = (req, res, next) => {
  // console.log(req.headers.admin)
  let q = { enabled: true };
  if (req.params.filter) {
    q.service_category = req.params.filter;
  }
  Services.find(q).exec((err, services) => {
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

exports.getProfile = (req, res, next) => {
  // console.log(req.headers.admin)
  User.findOne({ _id: req.headers.user }).exec((err, profile) => {
    if (err || !profile) {
      return res.status(409).json({
        error: true,
        message: "No Profile Found",
        err,
      });
    }

    if (profile.length < 1) {
      console.log(profile);
      return res.status(404).json({
        error: true,
        message: "No Profile Found",
        err,
      });
    }
    delete profile.password;
    delete profile._id;
    return res.status(201).json({
      message: "Your Profile",
      profile,
    });
  });
};

exports.viewProfile = (req, res, next) => {
  Work.find({ user: req.params.user }).exec((err, work) => {
    if (err || !work) {
      return res.status(409).json({
        error: true,
        message: "Server error: Error fetching profile data",
        err,
      });
    }

    Education.find({ user: req.params.user }).exec((_err, education) => {
      if (_err || !education) {
        return res.status(409).json({
          error: true,
          message: "Server error: Error fetching profile data",
          err: _err,
        });
      }

      return res.status(201).json({
        message: "Profile Info",
        education,
        work,
      });
    });
  });
};

exports.getProfiles = (req, res, next) => {
  let q = {};
  if (req.params.slug) {
    if (req.params.sub) {
      q = { status: "service", subservice: { $in: [req.params.sub] } };
    } else {
      q.status = "service";
    }
    q.service = req.params.service;
  } else {
    q.hireable = true;
  }
  console.log(q);
  console.log(req.params);
  User.find(q).exec((err, profiles) => {
    if (err || !profiles) {
      return res.status(409).json({
        error: true,
        message: "No Profiles Found",
        err,
      });
    }

    if (profiles.length < 1) {
      return res.status(404).json({
        error: true,
        message: "No Profiles Found",
        err,
      });
    }
    delete profiles.password;
    delete profiles._id;
    return res.status(201).json({
      message: "Your Profiles",
      profiles,
    });
  });
};

exports.getInterviews = (req, res, next) => {
  // console.log(req.headers.admin)
  Interview.find({ user: req.headers.user })
    .sort({ time: -1 })
    .populate({
      path: "application",
      populate: [{ path: "applicant" }, { path: "job" }],
    })
    .exec((err, interviews) => {
      if (err || !interviews) {
        return res.status(409).json({
          error: true,
          message: "No Interviews Found",
          err,
        });
      }

      if (interviews.length < 1) {
        console.log(interviews);
        return res.status(404).json({
          error: true,
          message: "No Interviews Found",
          err,
        });
      }
      return res.status(201).json({
        message: "Your Interviews",
        interviews,
      });
    });
};

exports.getBilling = (req, res, next) => {
  // console.log(req.headers.admin)
  Billing.find({ user: req.headers.user }).exec((err, billings) => {
    if (err || !billings) {
      return res.status(409).json({
        error: true,
        message: "No Billing Information Found",
        err,
      });
    }

    if (billings.length < 1) {
      console.log(billings);
      return res.status(404).json({
        error: true,
        message: "No Billing Information Found",
        err,
      });
    }
    return res.status(201).json({
      message: "Your Billing Information",
      billings,
    });
  });
};

exports.getEmployees = (req, res, next) => {
  Employee.find({ employer: req.headers.user })
    .populate(`job employee`)
    .exec((err, employees) => {
      if (err || !employees) {
        return res.status(409).json({
          error: true,
          message: "Employees Not Found",
          err,
        });
      }

      if (employees.length < 1) {
        console.log(employees);
        return res.status(404).json({
          error: true,
          message: "No Employees yet",
          err,
        });
      }
      return res.status(201).json({
        message: "All Employees",
        employees,
      });
    });
};

exports.getUsers = (req, res, next) => {
  // console.log(req.headers.admin)
  User.find({}).exec((err, profiles) => {
    if (err || !profiles) {
      return res.status(409).json({
        error: true,
        message: "No Users Found",
        err,
      });
    }

    if (profiles.length < 1) {
      console.log(profiles);
      return res.status(404).json({
        error: true,
        message: "No Users Found",
        err,
      });
    }
    let _profiles = profiles.flatMap((profile) => [
      {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        id: profile._id,
        pic: profile.pic,
      },
    ]);
    return res.status(201).json({
      message: "Your Users",
      profiles: _profiles,
    });
  });
};

exports.getSkills = (req, res, next) => {
  // console.log(req.headers.admin)
  Skill.find({ enabled: true }).exec((err, skills) => {
    if (err || !skills) {
      return res.status(409).json({
        error: true,
        message: "No Skills Found",
        err,
      });
    }

    if (skills.length < 1) {
      console.log(skills);
      return res.status(404).json({
        error: true,
        message: "No Skills Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Skills",
      skills,
    });
  });
};

exports.getSubServices = (req, res, next) => {
  // console.log(req.headers.admin)
  let q = { enabled: true };
  if (req.params.service) {
    q.service = req.params.service;
  }
  SubService.find(q).exec((err, subservices) => {
    if (err || !subservices) {
      return res.status(409).json({
        error: true,
        message: "No SubServices Found",
        err,
      });
    }

    if (subservices.length < 1) {
      console.log(subservices);
      return res.status(404).json({
        error: true,
        message: "No SubServices Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All SubServices",
      subservices,
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

exports.getService = (req, res, next) => {
  // console.log(req.params.id);
  SubService.find({ service: req.params.id }).exec((err, services) => {
    // Skill.find({ category: req.params.id }).exec((_err, skills) => {
    if (err) {
      return res.status(409).json({
        error: true,
        message: "Skill and Sub-services Not Found",
        err,
      });
    }

    if (!services || services.length < 1) {
      return res.status(404).json({
        error: true,
        message: "No Sub-services Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Sub-services",
      services,
    });
    // });
  });
};

exports.getPortfolio = (req, res, next) => {
  // console.log(req.params.id);
  Education.find({ user: req.headers.user }).exec((err, education) => {
    Work.find({ user: req.headers.user }).exec((_err, work) => {
      if (_err && err) {
        return res.status(409).json({
          error: true,
          message: "Work and education Not Found",
          err: { err, _err },
        });
      }

      if (!work || !education || (work.length < 1 && education.length < 1)) {
        console.log(work, education);
        return res.status(201).json({
          error: true,
          message: "No Works and education Found",
          work,
          education,
        });
      }

      return res.status(201).json({
        message: "All Works and Education",
        work,
        education,
      });
    });
  });
};

exports.getProject = (req, res, next) => {
  // console.log(req.params.id);
  Project.find({ user: req.headers.user }).exec((err, projects) => {
    if (err) {
      return res.status(409).json({
        error: true,
        message: "Project Not Found",
        err,
      });
    }

    if (!projects || projects.length < 1) {
      console.log(projects);
      return res.status(404).json({
        error: true,
        message: "No Projects Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Projects",
      projects,
    });
  });
};

exports.getJobPostings = (req, res, next) => {
  Job.find({ user: req.headers.user })
    .sort({ createdOn: -1 })
    .exec((err, jobs) => {
      if (err) {
        return res.status(409).json({
          error: true,
          message: "Jobs Not Found",
          err,
        });
      }

      if (!jobs || jobs.length < 1) {
        // console.log(jobs, categories);
        return res.status(404).json({
          error: true,
          message: "No Jobs Found",
          err,
        });
      }

      return res.status(201).json({
        message: "All Jobs",
        jobs,
      });
    });
};

exports.getJobApplications = (req, res, next) => {
  Application.find({ applicant: req.headers.user })
    .populate("poster job")
    .exec((err, applications) => {
      if (err) {
        return res.status(409).json({
          error: true,
          message: "Jobs Not Found",
          err,
        });
      }

      if (!applications || applications.length < 1) {
        // console.log(applications, categories);
        return res.status(404).json({
          error: true,
          message: "No Jobs Found",
          err,
        });
      }

      return res.status(201).json({
        message: "All your Applications",
        applications,
      });
    });
};

exports.getJobApplicants = (req, res, next) => {
  // console.log({ job: req.params.job });
  Application.find({ job: req.params.job })
    .populate("applicant")
    .exec((err, applicants) => {
      if (err) {
        console.log(err);
        return res.status(409).json({
          error: true,
          message: "Applicants Not Found",
          err,
        });
      }

      if (!applicants || applicants.length < 1) {
        // console.log(applicants, categories);
        return res.status(404).json({
          error: true,
          message: "No Applicants Found",
          err,
        });
      }

      return res.status(201).json({
        message: "All Applicants",
        applicants,
      });
    });
};

exports.jobs = (req, res, next) => {
  const { type } = req.params;
  const job_type = type;
  let q = { job_type };
  if (req.params.cat) {
    q.category = req.params.cat;
  }
  console.log(req.params);
  Job.find(q).exec((err, jobs) => {
    if (err) {
      return res.status(409).json({
        error: true,
        message: "Jobs Not Found",
        err,
      });
    }

    if (!jobs || jobs.length < 1) {
      // console.log(jobs);
      return res.status(404).json({
        error: true,
        message: "No Jobs Found",
        err,
      });
    }

    return res.status(201).json({
      message: "All Jobs",
      jobs,
    });
  });
};

// Update
exports.profile = (req, res, next) => {
  let _d = req.body;
  delete _d.iat;
  delete _d.exp;
  _d.set = true;
  _d.initialized = true;
  console.log(_d);
  User.findOneAndUpdate(
    { _id: req.headers.user },
    _d,
    { new: true },
    function (err, doc) {
      if (err) {
        console.error("err", err);
        return res
          .status(500)
          .json({ error: true, err, message: "Profile Update failed" });
      } else {
        console.log(doc);
        return res.status(201).json({
          message: "Profile Updated Successfully",
          profile: doc,
        });
      }
    }
  );
};

exports.setInterview = async (req, res, next) => {
  let _d = req.body;
  console.log(_d);
  delete _d.iat;
  delete _d.exp;
  if (_d.time) _d.time = new Date(_d.time).getTime();
  _d.user = req.headers.user;
  console.log(_d);
  const application = await Application.findOne({
    _id: _d.application,
  }).populate("applicant");
  console.log(application);
  Interview.findOneAndUpdate(
    { application: _d.application },
    _d,
    { new: true },
    function (err, doc) {
      if (err) {
        return res.status(500).json({
          error: true,
          err,
          message: "Error: Interview Schedule failed",
        });
      } else {
        console.log(doc);
        if (doc === null) {
          const i = new Interview(_d);
          i.save((error, interview) => {
            if (error || interview.length === 0) {
              console.log({ error, interview });
              return res.status(409).json({
                error: true,
                message: "Error: Interview Schedule failed",
                err: error,
              });
            }
            sendMail(
              application.applicant.email,
              `Your Interview has been scheduled`,
              {
                name: application.applicant.name,
                title: "Notification from Fillyjobs",
                content: `You have been shortlisted and an interview has been scheduled for ${new Date(
                  _d.time
                ).toUTCString()}. \b\n\b\n\b\n Be sure to schedule your day with that in mind. For more information...`,
                label: "Go to your Applications",
                link: "https://fillyjobs.com/me/applications",
              }
            );
            return res.status(201).json({
              message: "Interview Scheduled Successfully",
              interview,
            });
          });
        } else {
          sendMail(
            application.applicant.email,
            _d.cancelled
              ? `Your Interview has been cancelled`
              : `Your Interview has been scheduled`,
            {
              name: application.applicant.name,
              title: "Notification from Fillyjobs",
              content: _d.cancelled
                ? `It is sad for us to tell you this but your interview has been cancelled. Apply for other listings to improve your chances at landing a job. `
                : `Your interview has been rescheduled for ${new Date(
                    _d.time
                  ).toUTCString()}. \b\n\b\n\b\n Be sure to schedule your day with that in mind. For more information...`,
              label: "Go to your Applications",
              link: "https://fillyjobs.com/me/applications",
            }
          );
          return res.status(201).json({
            message: "Interview Updated Successfully",
            interview: doc,
          });
        }
      }
    }
  );
};

exports.updateApplication = (req, res, next) => {
  let _d = req.body;
  delete _d.iat;
  delete _d.exp;
  console.log(_d);
  Application.findOneAndUpdate(
    { poster: req.headers.user, _id: req.params.job },
    _d,
    { new: true },
    function (err, doc) {
      if (err) {
        console.error("err", err);
        return res
          .status(500)
          .json({ error: true, err, message: "Application Update failed" });
      } else {
        console.log(doc);
        return res.status(201).json({
          message: "Application Updated Successfully",
          profile: doc,
        });
      }
    }
  );
};

//Delete
exports.deleteBilling = (req, res, next) => {
  Billing.findOneAndDelete({ _id: req.params.id }, function (err, doc) {
    if (err) {
      console.error("err", err);
      return res
        .status(500)
        .json({
          error: true,
          err,
          message: "Billing Information Delete failed",
        });
    } else {
      console.log(err, doc);
      return res.status(201).json({
        message: "Billing Information Deleted Successfully",
        profile: doc,
      });
    }
  });
};


// Emmanuel's controllers additionalNesting

// register as service professional

exports.addServiceEntry=(req, res)=>{
  const { user } = req.headers;
    const { 
        title,
        description,
        category,
        sub_category,
        delivery_time,
        price,
        search_tags,
        gigPhotos,
        gigVideos
    } = req.body

    const service  = {
        title,
        user,
        description,
        category,
        sub_category,
        delivery_time,
        price,
        search_tags,
        gigPhotos,
        gigVideos
    }
    const newService = new ServiceEntry(service);
    newService.save((error, msg) => {
        if (error || msg.length === 0) {
          return res.status(409).json({
            error: true,
            message: "Creating service failed",
            err: error,
          });
        }
        return res.status(201).json({
            message: "Service Created Successfully",
            msg,
          });
    })

  }

  //get all services

exports.getServiceEntry = (req, res)=> {
    ServiceEntry.find({}).exec((err, services) => {
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

   //get services for logged 
   exports.myServices = async(req, res) => {
    ServiceEntry.find({ user: req.params.user }).exec((err, service) => {
      if (err || !service) {
        return res.status(409).json({
          error: true,
          message: "Server error: Error fetching user's created services",
          err,
        });
      }

      return res.status(201).json({
        message: "Services Info",
        service,
      });
    });
  }

  exports.updateServices = async(req,res)=>{
    console.log(req.body)
    const updates = Object.keys(req.body)
    const {title,description,category,sub_category,delivery_time,price} = req.body

    const allowedUpdates = {title,description,category,sub_category,delivery_time,price}

    // const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if (!allowedUpdates) {
      console.log("Invalid operation her")
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const Services = await ServiceEntry.findByIdAndUpdate(req.params.id)

        updates.forEach((update)=>Services[update]=req.body[update])
        await Services.save()
 
        res.send(Services)
        res.status(201).send()
    }catch (e){
        res.status(400).send(e)
    }
  }

  exports.deleteServices = async(req,res) =>{
    const _id = req.params.id
    console.log(_id)
    try{
      const Services = await ServiceEntry.findByIdAndDelete(_id)
      if(!Services){
          res.status(404).send()
      }
      res.status(200).send(Services)
  }catch(e){
      res.status(400).send()
  }
  }

 