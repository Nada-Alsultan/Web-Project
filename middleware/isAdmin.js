function isAdmin(req, res, next) {
    if (req.session.admin) {
        next();  // Proceed if the session exists and belongs to an admin
    } else {
        res.redirect('/admin/login');
    }
}
module.exports = isAdmin;