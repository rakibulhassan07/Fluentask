const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lf0gvrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db('Fluentask').collection('users');
    const teamsCollection = client.db('Fluentask').collection('teams');
    const invitationsCollection = client.db('Fluentask').collection('invitations');
    const notificationsCollection = client.db('Fluentask').collection('notifications');
    const messagesCollection = client.db('Fluentask').collection('messages');
    const tasksCollection = client.db('Fluentask').collection('tasks');
    
    // Users endpoints
    app.get('/users', async(req, res) => {
     const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post('/users', async(req, res) => {
      const user = req.body;
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email: user.email });
      if (existingUser) {
        return res.send({ message: 'User already exists',insertedId:null });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Update user role endpoint
    app.put('/users/:id/role', async(req, res) => {
      const id = req.params.id;
      const { role } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { role: role },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Update user role by email endpoint
    app.put('/users/email/:email/role', async(req, res) => {
      const email = req.params.email;
      const { role } = req.body;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: role },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Teams endpoints
    app.get('/teams', async(req, res) => {
      const result = await teamsCollection.find().toArray();
      res.send(result);
    });

    app.post('/teams', async(req, res) => {
      const team = req.body;
      const result = await teamsCollection.insertOne(team);
      res.send(result);
    });

    app.put('/teams/:id', async(req, res) => {
      const id = req.params.id;
      const updatedTeam = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedTeam,
      };
      const result = await teamsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete('/teams/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      
      try {
        // First, get the team to find the leader
        const team = await teamsCollection.findOne(query);
        if (!team) {
          return res.status(404).send({ message: 'Team not found' });
        }

        // Delete all messages associated with this team
        try {
          const messageDeleteResult = await messagesCollection.deleteMany({ teamId: id });
          console.log(`Deleted ${messageDeleteResult.deletedCount} messages for team ${id}`);
        } catch (messageError) {
          console.error('Error deleting team messages:', messageError);
          // Note: We continue with team deletion even if message deletion fails
        }

        // Delete the team
        const result = await teamsCollection.deleteOne(query);
        
        // If team deletion was successful and team had a leader, revert their role to 'member'
        if (result.deletedCount > 0 && team.leader) {
          try {
            await usersCollection.updateOne(
              { _id: new ObjectId(team.leader) },
              { $set: { role: 'member' } }
            );
          } catch (roleError) {
            console.error('Error reverting leader role:', roleError);
            // Note: We don't fail the entire operation if role update fails
          }
        }

        res.send({
          ...result,
          messagesDeleted: true,
          message: 'Team and associated messages deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).send({ message: 'Failed to delete team' });
      }
    });

    // Invitations endpoints
    app.post('/invitations', async(req, res) => {
      const invitation = req.body;
      const result = await invitationsCollection.insertOne(invitation);
      res.send(result);
    });

    app.get('/invitations/user/:email', async(req, res) => {
      const email = req.params.email;
      const invitations = await invitationsCollection.find({ 
        inviteeEmail: email, 
        status: 'pending' 
      }).toArray();
      res.send(invitations);
    });

    app.put('/invitations/:id/accept', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      
      try {
        // Get the invitation
        const invitation = await invitationsCollection.findOne(filter);
        if (!invitation) {
          return res.status(404).send({ message: 'Invitation not found' });
        }

        // Update invitation status
        await invitationsCollection.updateOne(filter, {
          $set: { 
            status: 'accepted',
            respondedAt: new Date().toISOString()
          }
        });

        // Add user to team members
        await teamsCollection.updateOne(
          { _id: new ObjectId(invitation.teamId) },
          { $addToSet: { members: invitation.inviteeId } }
        );

        // Create notification for team leader
        const notification = {
          recipientId: invitation.inviterId,
          type: 'invitation_accepted',
          message: `${invitation.inviteeName} accepted your team invitation`,
          teamName: invitation.teamName,
          read: false,
          createdAt: new Date().toISOString()
        };
        await notificationsCollection.insertOne(notification);

        res.send({ message: 'Invitation accepted successfully' });
      } catch (error) {
        console.error('Error accepting invitation:', error);
        res.status(500).send({ message: 'Failed to accept invitation' });
      }
    });

    app.put('/invitations/:id/decline', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      
      try {
        // Get the invitation
        const invitation = await invitationsCollection.findOne(filter);
        if (!invitation) {
          return res.status(404).send({ message: 'Invitation not found' });
        }

        // Update invitation status
        await invitationsCollection.updateOne(filter, {
          $set: { 
            status: 'declined',
            respondedAt: new Date().toISOString()
          }
        });

        // Create notification for team leader
        const notification = {
          recipientId: invitation.inviterId,
          type: 'invitation_declined',
          message: `${invitation.inviteeName} declined your team invitation`,
          teamName: invitation.teamName,
          read: false,
          createdAt: new Date().toISOString()
        };
        await notificationsCollection.insertOne(notification);

        res.send({ message: 'Invitation declined successfully' });
      } catch (error) {
        console.error('Error declining invitation:', error);
        res.status(500).send({ message: 'Failed to decline invitation' });
      }
    });

    // Notifications endpoints
    app.get('/notifications/user/:userId', async(req, res) => {
      const userId = req.params.userId;
      const notifications = await notificationsCollection.find({ 
        recipientId: userId 
      }).sort({ createdAt: -1 }).toArray();
      res.send(notifications);
    });

    app.put('/notifications/:id/read', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { read: true },
      };
      const result = await notificationsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put('/notifications/user/:userId/mark-all-read', async(req, res) => {
      const userId = req.params.userId;
      const filter = { recipientId: userId, read: false };
      const updateDoc = {
        $set: { read: true },
      };
      const result = await notificationsCollection.updateMany(filter, updateDoc);
      res.send(result);
    });

    // Mark individual notification as read
    app.put('/notifications/:id/mark-read', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { read: true },
      };
      const result = await notificationsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Team Chat Messages endpoints
    // Send a message to a team
    app.post('/teams/:teamId/messages', async(req, res) => {
      const teamId = req.params.teamId;
      const { message, senderId, senderName, senderEmail } = req.body;
      
      try {
        // Verify team exists
        const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });
        if (!team) {
          return res.status(404).send({ message: 'Team not found' });
        }

        // Verify sender is team leader or member
        const isLeader = team.leader === senderId;
        const isMember = team.members.includes(senderId);
        
        if (!isLeader && !isMember) {
          return res.status(403).send({ message: 'You are not authorized to send messages to this team' });
        }

        const messageData = {
          teamId: teamId,
          message: message,
          senderId: senderId,
          senderName: senderName,
          senderEmail: senderEmail,
          createdAt: new Date().toISOString(),
          edited: false
        };

        const result = await messagesCollection.insertOne(messageData);
        res.send(result);
      } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ message: 'Failed to send message' });
      }
    });

    // Get all messages for a team
    app.get('/teams/:teamId/messages', async(req, res) => {
      const teamId = req.params.teamId;
      const { userId } = req.query;
      
      try {
        // Verify team exists
        const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });
        if (!team) {
          return res.status(404).send({ message: 'Team not found' });
        }

        // Verify user is team leader or member
        const isLeader = team.leader === userId;
        const isMember = team.members.includes(userId);
        
        if (!isLeader && !isMember) {
          return res.status(403).send({ message: 'You are not authorized to view messages for this team' });
        }

        const messages = await messagesCollection.find({ teamId: teamId })
          .sort({ createdAt: 1 })
          .toArray();
        
        res.send(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send({ message: 'Failed to fetch messages' });
      }
    });

    // Delete a message (only sender can delete their own message)
    app.delete('/messages/:messageId', async(req, res) => {
      const messageId = req.params.messageId;
      const { userId } = req.body;
      
      try {
        // Find the message
        const message = await messagesCollection.findOne({ _id: new ObjectId(messageId) });
        if (!message) {
          return res.status(404).send({ message: 'Message not found' });
        }

        // Verify the user is the sender
        if (message.senderId !== userId) {
          return res.status(403).send({ message: 'You can only delete your own messages' });
        }

        const result = await messagesCollection.deleteOne({ _id: new ObjectId(messageId) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send({ message: 'Failed to delete message' });
      }
    });

    // Edit a message (only sender can edit their own message)
    app.put('/messages/:messageId', async(req, res) => {
      const messageId = req.params.messageId;
      const { userId, newMessage } = req.body;
      
      try {
        // Find the message
        const message = await messagesCollection.findOne({ _id: new ObjectId(messageId) });
        if (!message) {
          return res.status(404).send({ message: 'Message not found' });
        }

        // Verify the user is the sender
        if (message.senderId !== userId) {
          return res.status(403).send({ message: 'You can only edit your own messages' });
        }

        const updateDoc = {
          $set: { 
            message: newMessage,
            edited: true,
            editedAt: new Date().toISOString()
          }
        };

        const result = await messagesCollection.updateOne(
          { _id: new ObjectId(messageId) },
          updateDoc
        );
        res.send(result);
      } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).send({ message: 'Failed to edit message' });
      }
    });

    // Tasks endpoints
    // Get all tasks - frontend will handle filtering by team membership
    app.get('/tasks', async(req, res) => {
      try {
        const result = await tasksCollection.find().sort({ createdAt: -1 }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send({ message: 'Failed to fetch tasks' });
      }
    });

    // Create a new task
    app.post('/tasks', async(req, res) => {
      try {
        const task = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const result = await tasksCollection.insertOne(task);
        res.send(result);
      } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send({ message: 'Failed to create task', error: error.message });
      }
    });

    // Update a task
    app.put('/tasks/:id', async(req, res) => {
      try {
        const id = req.params.id;
        const updatedTask = {
          ...req.body,
          updatedAt: new Date()
        };
        delete updatedTask._id; // Remove _id from update object
        
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTask }
        );
        res.send(result);
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send({ message: 'Failed to update task' });
      }
    });

    // Delete a task
    app.delete('/tasks/:id', async(req, res) => {
      try {
        const id = req.params.id;
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send({ message: 'Failed to delete task' });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('server is running');
})
//hfshfdhsfht
app.listen(port,()=>{
    console.log(`server is sitting on port ${port}`);
})