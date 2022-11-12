const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const validEmail = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/
const validMobile = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/
const validName = /^[A-Za-z ]+$/


const createIntern = async (req, res) => {
    try {
        let data = req.body
        let { name, email, mobile, collegeName } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "plz give input of intern in request body" })
        }
        if (!name) {
            return res.status(400).send({ status: false, msg: "name is required" })
        }
        if (!validName.test(name)) {
            return res.status(400).send({ status: false, msg: "plz enter ur name in valid format" })
        }
        if (!email) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }
        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, msg: "plz enter ur emailId in valid format like this (example@xyz.xyz)" })
        }
        if (!mobile) {
            return res.status(400).send({ status: false, msg: "mobile is required" })
        }
        if (!validMobile.test(mobile)) {
            return res.status(400).send({ status: false, msg: "enter valid mobile number" })
        }
        let uniqueData = await userModel.find({ $and: [{ $or: [{ mobile: mobile }, { email: email }] }, { isDeleted: false }] })

        let arr = []
        uniqueData.map((i) => { arr.push(i.mobile, i.email) })

        if (arr.includes(mobile)) {
            return res.status(409).send({ status: false, msg: "mobile is already exsits" })
        }
        if (arr.includes(email)) {
            return res.status(409).send({ status: false, msg: "email is already exsits" })
        }
        if (!collegeName) {
            return res.status(400).send({ status: false, msg: "College name is required for finding that college where u can apply for ur internship" })
        }
        let findData = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!findData) {
            return res.status(404).send({ status: false, msg: " College doesn't exists" })
        }
        data['collegeId'] = findData._id

        let saveData = await internModel.create(data)
        let finalData = {
            isDeleted: saveData.isDeleted,
            name: saveData.name,
            email: saveData.email,
            mobile: saveData.mobile,
            collegeId: saveData._id
        }
        return res.status(201).send({ status: true, msg: finalData })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const getIntern = async (req, res) => {
    try {
        let data = req.query.collegeName

        if (!data) {
            return res.status(400).send({ status: false, msg: "give the input of collegeName" })
        }
        if (!validName.test(data)) {
            return res.status(400).send({ status: false, msg: "plz enter the college name in valid format" })
        }
        let findData = await collegeModel.findOne({ name: data, isDeleted: false })
        if (!findData) {
            return res.status(404).send({ status: false, msg: "college not found" })
        }
        let internsData = await internModel.find({ collegeId: findData._id, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 })
        if (!internsData) {
            return res.status(404).send({ status: false, msg: "data not found" })
        }
        let finalData = {
            name: findData.name,
            fullName: findData.fullName,
            logoLink: findData.logoLink,
            interns: internsData
        }
        return res.status(200).send({ status: true, data: finalData })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createIntern, getIntern }