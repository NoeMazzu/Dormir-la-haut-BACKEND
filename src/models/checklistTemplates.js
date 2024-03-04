const mongoose = require("mongoose");

const checklistTemplateSchema = mongoose.Schema({});

const ChecklistTemplate = mongoose.model(
  "checklistTemplates",
  checklistTemplateSchema
);

module.exports = ChecklistTemplate;
