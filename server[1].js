
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const profilesFile = path.join(__dirname, "profiles.json");

if (!fs.existsSync(profilesFile)) {
    fs.writeFileSync(profilesFile, "[]");
}

app.post("/create-profile", (req, res) => {
    const { name, bio, skills, social } = req.body;

    const profile = {
        id: Date.now(),
        name: name,
        bio: bio,
        skills: skills.split(",").map(skill => skill.trim()),
        social: social
    };

    const profiles = JSON.parse(fs.readFileSync(profilesFile, "utf8"));
    profiles.push(profile);

    fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));

    const skillsHTML = profile.skills
        .map(skill => `<span class="skill">${skill}</span>`)
        .join("");

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Profile Card</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="card">
                <div class="avatar">${profile.name.charAt(0).toUpperCase()}</div>
                <h1>${profile.name}</h1>
                <p>${profile.bio}</p>

                <div class="skills">
                    ${skillsHTML}
                </div>

                <a href="${profile.social}" target="_blank">
                    Social Profile
                </a>

                <br><br>
                <a href="/">Create Another Profile</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
