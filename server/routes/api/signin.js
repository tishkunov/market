const User = require('../../models/User');
const UserSession = require('../../models/UserSession');


module.exports = (app) => {
  /*app.get('/api/counters', (req, res, next) => {
    Counter.find()
      .exec()
      .then((counter) => res.json(counter))
      .catch((err) => next(err));
  });

  app.post('/api/counters', function (req, res, next) {
    const counter = new Counter();

    counter.save()
      .then(() => res.json(counter))
      .catch((err) => next(err));
  });

  app.delete('/api/counters/:id', function (req, res, next) {
    Counter.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((counter) => res.json())
      .catch((err) => next(err)); */


  

  app.post('/api/account/signup', (req, res, next) => {
    const fnStatus = (bool, mess) => {
      return res.send({
        success:bool,
        message: mess
      })
    } 

    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;


    !firstName ? fnStatus(false, 'Error: Missing first name cannot be blank') : false;

    !lastName ? fnStatus(false, 'Error: Missing last name cannot be blank') : false;
    
    !email ? fnStatus(false, 'Error: Missing email cannot be blank') : false;

    !password ? fnStatus(false, 'Error: Missing password cannot be blank') : false;

    email = email.toLowerCase();

    User.find({
      email:email
    }, (err, previousUsers) => {
      if (err) {
        return fnStatus(false, 'Error: Server error');
      } else if (previousUsers.length > 0) {
        return fnStatus(false, 'Error: Account already exist');
      }

      const newUser = new User();

      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);

      newUser.save((err, user) => {
        if (err) { return fnStatus(false, 'Error: Server error'); }
        return fnStatus(true, 'Signed up');
      });

    });
  });

  app.post('/api/account/signin', (req, res, next) => {
    const fnStatus = (bool, mess) => {
      return res.send({
        success:bool,
        message: mess
      })
    } 

    const { body } = req;
    const { password } = body;
    let { email } = body;

    !email ? fnStatus(false, 'Error: Missing email cannot be blank') : false;
    !password ? fnStatus(false, 'Error: Missing password cannot be blank')   : false;    

    email = email.toLowerCase();

      User.find({
        email:email,
      }, (err, users) => {
        err ? fnStatus(false, "Error: server error") : false;
        users.length != 1 ? fnStatus(false, "Error: Invalid") : false;

        const user = users[0];

        if (!user.validPassword(password)) {
          fnStatus(false, "Error: Invalid")
        }

        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
          if (err) { return fnStatus(false, 'Error: Server error'); }

          return res.send({
            success:true,
            message: 'Valid sign in',
            token: doc._id
          });
        });

    });
  });

  app.get('/api/account/verify', (req, res, next) => {
    const fnStatus = (bool, mess) => {
      return res.send({
        success:bool,
        message: mess
      })
    } 
    const { query } = req;
    const { token } = query;

    UserSession.find({
      _id:token,
      isDeleted:false
    }, (err, sessions) => {
      if (err) { fnStatus(false, "Error: server error")}

      if (sessions.length != 1)  {
       fnStatus(false, "Error: Invalid")
      }
      else {
        fnStatus(true, "Good")
      }

    });
  });

  app.get('/api/account/logout', (req, res, next) => {
    const fnStatus = (bool, mess) => {
      return res.send({
        success:bool,
        message: mess
      })
    } 
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate({
      _id:token,
      isDeleted:false
    }, {
      $set:{isDeleted:true}
    }, null,   (err, sessions) => {
      if (err) { fnStatus(false, "Error: server error")}
        fnStatus(true, "Good")
    });

  });
};