import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
});

async function checkCommits(user, repo) {
    const commitData = await octokit.paginate("GET /repos/{owner}/{repo}/commits", {
        owner: user,
        repo: repo,
        per_page: 100,
        headers: {
            "x-github-api-version": "2022-11-28",
        },
    },
        (response, done) => response.data.map((commit) => {
            let timestamp = commit.commit.committer.date;
            return ({ timestamp: timestamp, message: commit.commit.message, url: commit.url });
        }).sort((a, b) => {
            return new Date(x.timestamp) > new Date(y.timestamp) ? 1 : -1; // sort so most recent first
        })
    );

    return commitData;
}

async function renderCommitData(numEntries) {
    let dataContainer = document.getElementById("changelog-data");
    let commitData = (await checkCommits()).slice(0, numEntries);
    for (let commit of commitData) {
        let base = document.createElement("li");
        let link = document.createElement("a");
        link.href = commit.url;
        link.innerText = commit.timestamp;
        base.appendChild(link);
        base.innerText = `: ${commit.message}`;
        dataContainer.appendChild(base);
    }
}