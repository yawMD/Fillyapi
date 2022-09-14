const express = require("express");
const router = express.Router();
const { body } = require("../middleware/getbody");
const auth = require("../middleware/auth");
const {
  register,
  login,
  activate,
  sendMessage,
  job,
  jobs,
  getJobPostings,
  getCategory,
  education,
  work,
  getCategories,
  getSkills,
  profile,
  getPortfolio,
  getProfile,
  getProfiles,
  apply,
  viewProfile,
  getJobApplications,
  getJobApplicants,
  updateApplication,
  getUsers,
  setInterview,
  getInterviews,
  getService,
  getServiceCategories,
  getServices,
  getSubServices,
  project,
  getProject,
  search,
  hire,
  getEmployees,
  findContacts,
  addBilling,
  getBilling,
  deleteBilling,
  updatePassword,
  addServiceEntry,
  getServiceEntry,
  myServices,
  updateServices,
  deleteServices
} = require("../controllers/users");

router.post("/register", register);
router.post("/login", login);
router.post("/activate", body, activate);
router.post("/post", auth, body, job);
router.post("/billing", auth, body, addBilling);
router.post("/me/billing/:id", auth, deleteBilling);
router.post("/work", auth, body, work);
router.post("/project", auth, body, project);
router.post("/profile", auth, body, profile);
router.post("/education", auth, body, education);
router.post("/hire", auth, body, hire);
router.post("/send-message", body, sendMessage);
router.post("/apply/:job/:poster", auth, apply);
router.post("/me/postings/:job", auth, body, updateApplication);
router.post("/me/interview", auth, body, setInterview);
router.post("/me/password", auth, body, updatePassword);
//ServiceEntry
router.post('/service-entry',auth,addServiceEntry);
router.get("/services-entry",auth, getServiceEntry);
router.get("/my-services/:user",auth,myServices)
router.patch("/service-update/:id",auth, updateServices)
router.delete("/my-services/:id",auth,deleteServices)
//ServiceEntry

router.get("/service-categories", getServiceCategories);
router.get("/categories", getCategories);
router.get("/services", getServices);
router.get("/services/:filter", getServices);
router.get("/jobs/:type", jobs);
router.get("/search/:cat/:filter/:query", search);
router.get("/subservices/:service", getSubServices);
router.get("/skills", getSkills);
router.get("/users", getUsers);
router.get("/contacts", getUsers);
router.get("/profiles", getProfiles);
router.get("/profiles/:slug/:service", getProfiles);
router.get("/profiles/:slug/:service/:sub", getProfiles);
router.get("/jobs/:type/:cat", jobs);
router.get("/profile/:user", viewProfile);

router.get("/category/:id", auth, getCategory);
router.get("/service/:id", auth, getService);
router.get("/me/jobs", auth, getJobPostings);
router.get("/me/billing", auth, getBilling);
router.get("/me/applications", auth, getJobApplications);
router.get("/me/interviews", auth, getInterviews);
router.get("/me/portfolio", auth, getPortfolio);
router.get("/me/project", auth, getProject);
router.get("/me/applicants/:job", auth, getJobApplicants);
router.get("/me/profile", auth, getProfile);
router.get("/me/employees", auth, getEmployees);
router.get("/me/addressfind/:query", auth, findContacts);

module.exports = router;
