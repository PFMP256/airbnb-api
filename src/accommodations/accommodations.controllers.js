const Accommodations = require("../models/accommodations.model");
const Places = require("../models/places.model");
const Users = require("../models/user.model");

const uuid = require("uuid");
const Roles = require("../models/roles.model");

const getAllAccommodations = async () => {
  const data = await Accommodations.findAll({
    include: [
        {
            model: Places,
            
        },
        {
          model: Users,
          as: 'user'
        },
    ],
  });
  return data;
};

const getAccommodationById = async (id) => {
  const data = await Accommodations.findOne({
    where: {
      id,
    },
    include:[ {
      model: Places,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },{
      model: Users,
      as: 'user',
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    }
  ],
    attributes: {
      exclude: ["createdAt", "updatedAt", "userId", "placeId", "hostId"],
    },
  });
  return data;
};

const getAllUserLogAccommodations = async (userId) => {
  const data = await Accommodations.findAll({
    where: {
      hostId: userId,
    },
    include: [
      {
        model: Places,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: Users,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
    ],
  });
  return data;
};

const createAccommodation = async (data, hostId, placeId) => {
  const newAccommodation = await Accommodations.create({
    ...data,
    id: uuid.v4(),
    hostId,
    placeId,
  });
  return newAccommodation;
};

const editAccommodation = async (data, accommodationId, userId, roleId) => {
  const dataRoles = await Roles.findAll({ where: { name: ["admin", "host"] } });
  const roles = {};

  dataRoles.forEach((role) => {
    roles[role.dataValues.name] = role.dataValues.id;
  });

  if (roleId === roles["admin"]) {
    const { id, hostId, score, ...restOfData } = data;
    const response = await Accommodations.update(
      { ...restOfData },
      { where: { id: accommodationId } }
    );
    return response;
  }

  if (roleId === roles["host"]) {
    const { id, hostId, score, ...restOfData } = data;
    const response = await Accommodations.update(
      { ...restOfData },
      { where: { id: accommodationId, hostId: userId } }
    );
    return response;
  }
};

const deleteAccommodation = async (accommodationId, roleId, userId) => {
  const dataRoles = await Roles.findAll({ where: { name: ["admin", "host"] } });
  const roles = {};

  dataRoles.forEach((role) => {
    roles[role.dataValues.name] = role.dataValues.id;
  });

  if (roleId === roles["admin"]) {
    const response = await Accommodations.destroy({
      where: { id: accommodationId },
    });
    return response;
  }

  if (roleId === roles["host"]) {
    const response = await Accommodations.destroy({
      where: { id: accommodationId, hostId: userId },
    });
    return response;
  }
};

module.exports = {
  getAllAccommodations,
  getAccommodationById,
  getAllUserLogAccommodations,
  createAccommodation,
  editAccommodation,
  deleteAccommodation,
};
