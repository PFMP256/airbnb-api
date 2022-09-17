const accommodationControllers = require('./accommodations.controllers')

const getAll = (req, res) => {
    accommodationControllers.getAllAccommodations()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(400).json(err)
        })
}

const getById = (req, res) => {
    const id = req.params.id
    accommodationControllers.getAccommodationById(id)
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(400).json(err)
        })
}

const getAllUserLog = (req, res) => {
    const userId = req.params.userId
    accommodationControllers.getAllUserLogAccommodations(userId)
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(400).json(err)
        })
}



  const edit = (req, res) => {
    const data = req.body;
    const accommodationId = req.params.id;
    const userId = req.user.id;
    const roleId = req.user.roleId;
  
    if (!Object.keys(data).length) {
      return res.status(400).json({
        message: "All fields must be completed",
        fields: {
          title: "string",
          description: "string",
          guests: "integer",
          rooms: "integer",
          beds: "integer",
          bathrooms: "number",
          price: "number",
          hostId: "uuid",
          placeId: "uuid",
          commision: "number",
        },
      });
    } else {
      accommodationControllers
        .editAccommodation(data, accommodationId, userId, roleId)
        .then((response) => {
          if (response[0]) {
            return res.status(200).json({
              message: `Accommodation edited succesfully with id ${accommodationId}`,
            });
          } else {
            return res.status(404).json({ message: "Invalid id" });
          }
        })
        .catch((err) => {
          res.status(400).json({ message: err });
        });
    }
  };
  
    const remove = (req, res) => {
        const accommodationId = req.params.id;
        const userId = req.user.id;
        const roleId = req.user.roleId;

        accommodationControllers.deleteAccommodation(accommodationId, userId, roleId)
            .then(response => {
                if (response) {
                    return res.status(200).json({
                        message: `Alojamiento borrado con el id ${accommodationId}`,
                    });
                } else {
                    return res.status(404).json({ message: "Id invalido" });
                }
            })
            .catch(err => {
                res.status(400).json({ message: err });
            });
    };


module.exports = {
    getAll,
    getById,
    getAllUserLog,
    edit,
    remove
}


