const collegeModel = require("../models/collegeModel")
const validName = /^[A-Za-z ]+$/    
const validLogo = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|jfif))$/i


const createCollege = async (req, res) => {
    try {
        let data = req.body
        let {name, fullName, logoLink} = data  
        
        if (Object.keys(data).length == 0) {
            return res.status(400).send({status : false, msg : "plz give input of collegeData in request body"})
        }
        if (!name) {
            return res.status(400).send({status : false, msg : "college Name is required"})
        }
        if (!validName.test(name)) {
            return res.status(400).send({status : false, msg : "plz enter the college name in valid format"})
        }
        let findName = await collegeModel.findOne({name : name,isDeleted : false})
        if (findName) {
            return res.status(400).send({status : false, msg : "collegeName already exist"})
        }
        if (!fullName) {
            return res.status(400).send({status : false, msg : "college fullName is required"})
        }
        if (!validName.test(fullName)) {
            return res.status(400).send({status : false, msg : "plz enter the college fullName in valid format"})
        }
        if (!logoLink) {
            return res.status(400).send({status : false, msg : "logoLink is required"})
        }
        if (!validLogo.test(logoLink)) {
            return res.status(400).send({status : false, msg : "logoLink should be an aws S3 url"})
        }

        let saveData = await collegeModel.create(data)
        
        let finalData = {
            name : saveData.name,
            fullName : saveData.fullName,
            logoLink : saveData.logoLink,
            isDeleted : saveData.isDeleted
        }
        return res.status(201).send({status : true, data : finalData})
    } catch (err) {
        return res.status(500).send({status : false, msg : err.message})
    }
}


module.exports = {createCollege}