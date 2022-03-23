const Certificate = require('./../models/certificateModel')

exports.addCertificate = async (req, res) => {
    try {
        // console.log(2);
        const cert = await Certificate.create({ 'name': req.body.name });
        res.status(201).json({
            status: "Success",
            data: {
                cert
            }
        })
    }
    catch (e) {
        res.status(500).json({
            status: "Fail"
        })
    }

}
exports.deleteAll = async (req, res) => {
    try {
        await Certificate.deleteMany();
        res.status(204).json({
            status: "success"
        });
    } catch (e) {
        res.status(500).json({
            status: "Fail"
        })
    }
}