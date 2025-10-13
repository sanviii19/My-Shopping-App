const sendAdminInfoController = (req, res) => {
    res.status(200).json({
        isSuccess: true,
        message: "user is Admin",
    })
}

module.exports = { sendAdminInfoController };