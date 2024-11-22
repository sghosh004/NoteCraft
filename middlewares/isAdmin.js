const User = require('../models/User')

const isAdmin = async (req, res, next) => {
    if(req.session.user){
        const user = await User.findOne({username: req.session.user.username})
        if (user.role == 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    }else{
        res.redirect('/login')
    }
};

module.exports = isAdmin;