let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
function getAssignments(req, res) {

    console.log(req.query)

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    Assignment.find()
        .skip(skip)
        .limit(limit)
        .exec((err, assignments) => {
            if (err) {
                return res.status(500).send(err);
            }

            Assignment.countDocuments({}, (err, totalDocs) => {
                if (err) {
                    return res.status(500).send(err);
                }

                const totalPages = Math.ceil(totalDocs / limit);

                res.send({
                    docs: assignments,
                    totalDocs: totalDocs,
                    limit: limit,
                    page: page,
                    totalPages: totalPages,
                    pagingCounter: skip + 1,
                    hasPrevPage: page > 1,
                    hasNextPage: page < totalPages,
                    prevPage: page > 1 ? page - 1 : null,
                    nextPage: page < totalPages ? page + 1 : null
                });
            });
        });
}


// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
