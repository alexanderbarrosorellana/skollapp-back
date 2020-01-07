const FamilyGroup = require('../models/FamilyGroup');
const User = require('../models/User');
const TimeZone = require('../models/TimeZone');

const getFamilyGroups = async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findById(userId).populate('familyGroups');
    const { familyGroups } = user;
    const familyGroupsArray = familyGroups.map(familyGroup => {
      return { id: familyGroup._id, name: familyGroup.name };
    });
    res.status(200).send(familyGroupsArray);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFamilyGroup = async (req, res) => {
  const {
    userId,
    params: { groupId }
  } = req;
  try {
    const familyGroup = await FamilyGroup.findById(groupId);
    const { users } = familyGroup;
    const findUser = users.find(user => user.toString() === userId.toString());
    if (!findUser) {
      return res.status(401).send({ message: 'You are not authorized to access this information' });
    }
    return res.status(200).send(familyGroup);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const createFamilyGroup = async (req, res) => {
  const {
    userId,
    body: { name, timeZoneId }
  } = req;

  try {
    const timeZone = await TimeZone.findById(timeZoneId);
    const familyGroup = new FamilyGroup({ name, timeZone });
    const user = await User.findById(userId);
    familyGroup.users.push(user);
    const savedFamilyGroup = await familyGroup.save();
    user.familyGroups.push(savedFamilyGroup);
    await user.save();
    const { _id, users } = savedFamilyGroup;
    const usersArray = users.map(u => {
      return { id: u._id, name: u.name };
    });
    return res.status(201).send({
      message: 'Family Group created successfuly',
      familyGroup: { id: _id, name, users: usersArray }
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateFamilyGroup = async (req, res) => {
  const {
    userId,
    params: { groupId },
    body: incomingFamilyGroup
  } = req;
  if (!incomingFamilyGroup) {
    return res.status(400).send({ message: 'Empty Family Group' });
  }
  try {
    const foundFamilyGroup = await FamilyGroup.findById(groupId);
    const { users } = foundFamilyGroup;
    const findUser = users.find(user => user.toString() === userId);
    if (!findUser) {
      return res.status(401).send({ message: 'You are not authorized to access this information' });
    }

    // when removing all users from family group
    if (!incomingFamilyGroup.users || incomingFamilyGroup.users.length === 0) {
      foundFamilyGroup.users.forEach(async userIdObject => {
        const u = await User.findById(userIdObject);
        const filteredFamilyGroups = u.familyGroups.filter(
          familyGroupObjectId => familyGroupObjectId.toString() !== groupId
        );
        u.familyGroups = filteredFamilyGroups;
        await u.save();
      });
    }

    // check if there are new or removed users
    if (incomingFamilyGroup.users) {
      const idUsers = foundFamilyGroup.users.map(userObjectId => userObjectId.toString());
      // new Users
      const finalUsers = incomingFamilyGroup.users.filter(user => {
        return !idUsers.includes(user);
      });
      finalUsers.forEach(async finalUserId => {
        const u = await User.findById(finalUserId);
        if (!u.familyGroups.includes(groupId)) {
          u.familyGroups.push(groupId);
        }
        await u.save();
      });
      // removed users
      const removedUsers = idUsers.filter(idUser => !incomingFamilyGroup.users.includes(idUser));
      removedUsers.forEach(async removedUserId => {
        const u = await User.findById(removedUserId);
        if (u.familyGroups.includes(groupId)) {
          const newFamilyGroups = u.familyGroups.filter(familyGroupId => {
            return familyGroupId.toString() !== groupId;
          });
          u.familyGroups = newFamilyGroups;
        }
        await u.save();
      });
    }

    // check if timeZoneId has been changed
    const timeZone = await TimeZone.findById(incomingFamilyGroup.timeZone);
    // for some reason comparing two object ids wont work, thats why here it is used "toString()"
    if (timeZone._id.toString() !== foundFamilyGroup.timeZone.toString()) {
      foundFamilyGroup.timeZone = timeZone;
    }
    foundFamilyGroup.users = incomingFamilyGroup.users;
    foundFamilyGroup.name = incomingFamilyGroup.name;
    const savedFamilyGroup = await foundFamilyGroup.save();
    return res
      .status(200)
      .send({ message: 'Family Group updated successfuly', familyGroup: savedFamilyGroup });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const destroyFamilyGroup = async (req, res) => {
  const {
    params: { groupId }
  } = req;
  try {
    const familyGroup = await FamilyGroup.findById(groupId);
    if (!familyGroup) {
      return res.status(404).send({ message: 'Family Group not found' });
    }
    if (familyGroup.users.length >= 1) {
      familyGroup.users.forEach(async userIdObject => {
        const u = await User.findById(userIdObject);
        const filteredFamilyGroups = u.familyGroups.filter(
          familyGroupObjectId => familyGroupObjectId.toString() !== groupId
        );
        u.familyGroups = filteredFamilyGroups;
        await u.save();
      });
    }
    await FamilyGroup.deleteOne(familyGroup);
    return res.status(200).send({ message: 'Family Group destroyed successfuly' });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  createFamilyGroup,
  getFamilyGroups,
  getFamilyGroup,
  updateFamilyGroup,
  destroyFamilyGroup
};