// Load jobs on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, fetching jobs...');
    displayJobs();
});

// Post a new job
async function postJob() {
    const title = document.getElementById('jobTitle').value;
    const description = document.getElementById('jobDescription').value;
    const location = document.getElementById('jobLocation').value;
    const salary = document.getElementById('jobSalary').value;
    const category = document.getElementById('jobCategory').value;

    if (!title || !description || !location || !salary || !category) {
        alert('Please fill out all fields.');
        return;
    }

    const job = { title, description, location, salary, category };

    try {
        console.log('Posting job...', job);
        const response = await fetch('http://localhost:3000/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(job)
        });

        if (response.ok) {
            console.log('Job posted successfully');
            // Clear form
            document.getElementById('jobTitle').value = '';
            document.getElementById('jobDescription').value = '';
            document.getElementById('jobLocation').value = '';
            document.getElementById('jobSalary').value = '';
            document.getElementById('jobCategory').value = '';
            displayJobs();
        } else {
            const errorData = await response.json();
            console.error('Failed to post job:', errorData.message);
            alert('Error posting job: ' + (errorData.message || 'Server error'));
        }
    } catch (error) {
        console.error('Error posting job:', error.message);
        alert('Failed to post job. Check console for details.');
    }
}

// Display jobs with optional category filter
async function displayJobs() {
    const jobList = document.getElementById('jobList');
    const filterCategory = document.getElementById('filterCategory').value;
    jobList.innerHTML = '';

    try {
        console.log('Fetching jobs with filter:', filterCategory);
        const response = await fetch(`http://localhost:3000/api/jobs${filterCategory ? `?category=${filterCategory}` : ''}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const jobs = await response.json();
        console.log('Jobs fetched:', jobs);

        if (jobs.length === 0) {
            jobList.innerHTML = '<p class="text-center text-gray-500">No jobs available.</p>';
            return;
        }

        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card bg-white p-6 rounded-lg shadow-md';
            jobCard.innerHTML = `
                <h3 class="text-xl font-bold">${job.title}</h3>
                <p class="text-gray-600"><strong>Category:</strong> ${job.category}</p>
                <p class="text-gray-600"><strong>Description:</strong> ${job.description}</p>
                <p class="text-gray-600"><strong>Location:</strong> ${job.location}</p>
                <p class="text-gray-600"><strong>Salary:</strong> ${job.salary}</p>
                <p class="text-gray-500 text-sm"><strong>Posted:</strong> ${new Date(job.postedDate).toLocaleDateString()}</p>
                <button onclick="openApplyModal('${job._id}')" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Apply Now</button>
            `;
            jobList.appendChild(jobCard);
        });
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        jobList.innerHTML = '<p class="text-center text-gray-500">Failed to load jobs. Check backend or console for details.</p>';
    }
}

// Open application modal
function openApplyModal(jobId) {
    document.getElementById('applyJobId').value = jobId;
    document.getElementById('applyModal').classList.remove('hidden');
}

// Close application modal
function closeModal() {
    document.getElementById('applyModal').classList.add('hidden');
    document.getElementById('applicantName').value = '';
    document.getElementById('applicantEmail').value = '';
    document.getElementById('applicantResume').value = '';
}

// Submit job application
async function submitApplication() {
    const jobId = document.getElementById('applyJobId').value;
    const name = document.getElementById('applicantName').value;
    const email = document.getElementById('applicantEmail').value;
    const resume = document.getElementById('applicantResume').value;

    if (!name || !email || !resume) {
        alert('Please fill out all fields.');
        return;
    }

    const application = { jobId, name, email, resume };

    try {
        console.log('Submitting application...', application);
        const response = await fetch('http://localhost:3000/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(application)
        });

        if (response.ok) {
            console.log('Application submitted successfully');
            alert('Application submitted successfully!');
            closeModal();
        } else {
            const errorData = await response.json();
            console.error('Failed to submit application:', errorData.message);
            alert('Error submitting application: ' + (errorData.message || 'Server error'));
        }
    } catch (error) {
        console.error('Error submitting application:', error.message);
        alert('Failed to submit application. Check console for details.');
    }
}