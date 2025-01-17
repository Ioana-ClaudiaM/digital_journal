const db = require('../database/dbInit');
const admin = require('firebase-admin');

const getUserResources = async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('resources')
      .get();
    
    const resources = [];
    snapshot.forEach(doc => {
      resources.push({ id: doc.id, ...doc.data() });
    });
    return res.status(200).json(resources);
  } catch (error) {
    console.error('Error retrieving resources:', error);
    return res.status(500).json({ message: 'Error retrieving resources' });
  }
};

const addResource = async (req, res) => {
  const { userId, resource } = req.body;
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const docRef = await db
      .collection('users')
      .doc(userId)
      .collection('resources')
      .add({
        ...resource,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

    const addedResource = {
      id: docRef.id,
      ...resource,
    };

    return res.status(200).json({
      message: 'Resource added successfully!',
      resource: addedResource
    });
  } catch (error) {
    console.error('Error adding resource:', error);
    return res.status(500).json({ message: 'Error adding resource' });
  }
};



module.exports = { addResource, getUserResources };
