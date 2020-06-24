module.exports = (app) => {
    const users = require('../controllers/controller.js');

    // Create a new User
    app.post('/users', users.create);

    // Retrieve all Users
    app.get('/users', users.findAll);

    // Retrieve a single User with userId
    app.get('/users/:userId', users.findOne);

    // Login an User with email-id & password
    app.get('/userLogin', users.login);

    // Update an User with userId
    app.put('/users/:userId', users.update);

    // Delete an User with userId
    app.delete('/users/:userId', users.delete);
}