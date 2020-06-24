const User = require('../models/model.js');
const bcrypt = require('bcrypt');

// Create and Save a new User
exports.create = (req, res) => {
                
                // Create a User
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(9)),
                    birthdate: req.body.birthdate
                });
                // Save User in the database
                user.save()
                    .then(data => {
                        data.password = undefined;
                        res.send({
                            status: "Success",
                            data: data
                        });
                    }).catch(err => {
                        res.status(500).send({
                            status: "Error",
                            message: err.message || "Some error occurred while creating the User."
                        });
                    });
       
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(users => {            
            for(var i=0; i < users.length; i++) {
                users[i].password = undefined;
            }
            res.send({
                status: "Success",
                data: users
            });
        }).catch(err => {
            res.status(500).send({
                status: "Error",
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {

            const birthday = new Date(user.birthdate);
            var month = birthday.getMonth() + 1;
            var day = birthday.getDate();

            var today = new Date(),
                year = today.getFullYear(),
                next = new Date(year, month - 1, day);

            today.setHours(0, 0, 0, 0);

            if (today > next) {
                next.setFullYear(year + 1);
            }

            let daysLeft = Math.round((next - today) / 8.64e7);

            if (daysLeft <= 2) {
                user.password = undefined;
                res.send({
                    status: "Success",
                    data: user
                });
            } else {
                user.birthdate = undefined;
                user.password = undefined;
                res.send({
                    status: "Success",
                    data: user
                });
            }

            if (!user) {
                return res.status(404).send({
                    status: "Error",
                    message: "User not found with id: " + req.params.userId
                });
            }
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    status: "Error",
                    message: "User not found with id: " + req.params.userId
                });
            }
            return res.status(500).send({
                status: "Error",
                message: "Error retrieving user with id: " + req.params.userId
            });
        });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(9)),
            birthdate: req.body.birthdate
        }, {
            new: true
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: "Error",
                    message: "User not found with id: " + req.params.userId
                });
            }
            user.password = undefined;
            res.send({
                status: "Success",
                data: user
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    status: "Error",
                    message: "User not found with id: " + req.params.userId
                });
            }
            return res.status(500).send({
                status: "Error",
                message: "Error updating user with id: " + req.params.userId
            });
        });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: "Error",
                    message: "User not found with id: " + req.params.userId
                });
            }
            res.send({
                status: "Success",
                message: "User deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    status: "Error",
                    message: "User not found with id: " + req.params.userId
                });
            }
            return res.status(500).send({
                status: "Error",
                message: "Could not delete user with id: " + req.params.userId
            });
        });
};

// Login an user with email & password
exports.login = (req, res) => {
    User.findOne({
            "email": req.body.email
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: "Error",
                    message: "User not found with email-id: " + req.body.email
                });
            }
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    status: "Success",
                    message: "Login Successful! "
                });
            } else {
                res.send({
                    status: "Error",
                    message: "Wrong Password for email-id: " + req.body.email
                });
            }
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    status: "Error",
                    message: "User not found with email-id: " + req.body.email
                });
            }
            return res.status(500).send({
                status: "Error",
                message: "Error retrieving user with email-id: " + req.body.email
            });
        });
};