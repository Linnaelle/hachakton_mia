const emailVerifiedRequired = (req, res, next) => {
    if (!req.user.isEmailVerified) {
        return res.status(403).json({ 
        message: 'Veuillez vérifier votre adresse email avant d\'accéder à cette fonctionnalité',
        verificationRequired: true
        })
    }
    next()
}

module.exports = emailVerifiedRequired