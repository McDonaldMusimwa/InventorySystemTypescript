//const Request = require('express'); // Use 'Request' instead of 'request'
//const Response = require('express'); // Use 'Response' instead of 'response'
const NewUser = require('../models/user'); // Correctly import the 'NewUser' model
const bcrypt = require('bcrypt');

const  UserController = {
     async createUser(req, res) {
        //#swagger.tags=['User']
        try {
            // Extract user information from the request body
            const hashedPassword = await bcrypt.hash(req.body.password,10)
            const newUser = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password:hashedPassword
            };

            
            // Validate the input (you can use a library like Joi for this)
            if (!newUser.lastname || !newUser.firstname || !newUser.password || !newUser.email) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

           
            const User = new NewUser.User(newUser); // Create a new user with the 'NewUser' model
            const createdUser = await User.save(); // Save the user to the database
            res.status(200).json({ success: "created successfully" });
            return { ...createdUser._doc, _id: createdUser.toString() };

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = UserController; // Export the 'UserController' class
