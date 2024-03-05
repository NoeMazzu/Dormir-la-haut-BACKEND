// ROUTE CHECKLIST UPDATE
router.patch("/checklistUpdate", (req, res) => {
    User.findOne({ token: req.body.token }).then((data) => {
      if (!data) return res.json({ result: false, error: "User does not exist" });
    });
  
    User.updateOne(
      { checklists: { $elemMatch: { title: req.body.titleToSearch } } },
      { $set: { "checklists.$.title": req.body.newTitle } }
    ).then(() => {
      User.updateOne(
        {
          checklists: { $elemMatch: { title: req.body.newTitle } },
        },
        { $set: { "checklists.$.tasks.$[i]": req.body.newTaskDoc } },
        {
          arrayFilters: [{ "i.itemName": req.body.taskNameToSearch }],
        }
      ).then((data) => {
        if (data.modifiedCount) return res.json({ result: true, data });
      });
    }).catch(error => res.json({ result: false, error }));
  });
  