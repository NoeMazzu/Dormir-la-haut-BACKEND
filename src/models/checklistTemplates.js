const mongoose = require("mongoose");

const checklistTemplateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  item:[String]
});

const ChecklistTemplate = mongoose.model(
  "checklistTemplates",
  checklistTemplateSchema
);

module.exports = ChecklistTemplate;
