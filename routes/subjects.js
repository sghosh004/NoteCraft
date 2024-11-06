const express = require('express')
const router = express.Router()

const subjects = {
    'First Year': ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
    'Second Year': ['Data Structures', 'Algorithms', 'Database Management Systems', 'Computer Networks'],
    'Third Year': ['Software Engineering', 'Operating Systems', 'Web Development', 'Artificial Intelligence'],
    'Fourth Year': ['Machine Learning', 'Cloud Computing', 'Cyber Security', 'Mobile App Development']
}
router.get('/:year', (req, res) => {
    const year = req.params.year;
    const subjectsList = subjects[year] || [];
    res.render('subjects', { year, subjectsList });
});

module.exports = router