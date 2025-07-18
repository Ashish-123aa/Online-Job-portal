const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');

// Get all jobs or filter by category
router.get('/jobs', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const jobs = await Job.find(query);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
});

router.post('/jobs', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: 'Error posting job', error });
    }
});


router.post('/applications', async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: 'Error submitting application', error });
    }
});

module.exports = router;