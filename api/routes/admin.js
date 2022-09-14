const express = require("express");
const router = express.Router();
const { body } = require("../middleware/getbody");
const auth = require("../middleware/auth");
const {
  register,
  checkAuth,
  login,
  addCategory,
  addSubCategory,
  addSkill,
  getCategories,
  users,
  updateCategory,
  getCategory,
  addService,
  addSubService,
  getServices,
  getService,
  updateService,
  addServiceCategory,
  getServiceCategories,
} = require("../controllers/admin");

router.post("/register", body, register);
router.post("/isAuth", checkAuth);
router.post("/login", body, login);
router.post("/category", auth, body, addCategory);
router.post("/servicecategory", auth, body, addServiceCategory);
router.post("/sub-category", auth, body, addSubCategory);
router.post("/service", auth, body, addService);
router.post("/sub-service", auth, body, addSubService);
router.post("/skill", auth, body, addSkill);

router.get("/categories", auth, getCategories);
router.get("/servicecategories", auth, getServiceCategories);
router.get("/services", auth, getServices);
router.get("/customers", auth, users);
router.get("/category/:id", auth, getCategory);
router.get("/service/:id", auth, getService);

router.post("/category/:id", body, auth, updateCategory);
router.post("/service/:id", body, auth, updateService);

module.exports = router;
