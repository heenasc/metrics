/*import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        invoke('getText', { example: 'my-invoke-variable' }).then(setData);
    }, []);

    return (
        <div>
            {data ? data : 'Loading...'}
        </div>
    );
}

export default App;*/



import React, { useEffect, useState } from 'react';
import { requestJira } from '@forge/bridge';
import api, { route } from "@forge/api";

function App() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [selectedProjectKey, setSelectedProjectKey] = useState(null);
    const [sprintsAndIssues, setSprintsAndIssues] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await requestJira(`/rest/api/3/project/search`, {
                headers: {
                    'content-type': 'application/json'
                }
            });
            const responseJson = await response.json();
            const projectNames = responseJson.values.map((project) => ({
                key: project.key,
                name: project.name
            }));
            setProjects(projectNames);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setLoading(false);
        }
    };


    const board = async () => {
        try {
            const sprintsResponse = await requestJira(`/rest/agile/1.0/board/155`, {
                headers: {
                    'content-type': 'application/json'
                }
            });
            const sprintsData = await sprintsResponse.json();
            console.log("board",sprintsData);
            return sprintsData.values || [];
        } catch (error) {
            console.error('Error fetching sprints:', error);
            return [];
        }
    };
    const fetchSprints = async (boardId) => {
        try {
            const sprintsResponse = await api.asUser().requestJira(route`/rest/agile/latest/1.0/board/${boardId}/sprint`);
            const sprintsData = await sprintsResponse.json();
            console.log("sprintsData",sprintsData);
            return sprintsData.values || [];
        } catch (error) {
            console.error('Error fetching sprints:', error);
            return [];
        }
    };

    const fetchIssuesForSprint = async (boardId, sprintId) => {
        try {
            const issuesResponse = await api.asUser().requestJira(route`/rest/agile/1.0/board/${boardId}/sprint/${sprintId}/issue`);
            const issuesData = await issuesResponse.json();
            return issuesData.issues.map(issue => issue.key);
        } catch (error) {
            console.error('Error fetching issues for sprint:', error);
            return [];
        }
    };

    const fetchSprintsAndIssues = async (boardId) => {
        try {
            const sprints = await fetchSprints(boardId);
            const promises = sprints.map(async sprint => {
                const issues = await fetchIssuesForSprint(boardId, sprint.id);
                return { sprintId: sprint.id, issueKeys: issues };
            });
            const allSprintsAndIssues = await Promise.all(promises);
            return allSprintsAndIssues;
        } catch (error) {
            console.error('Error fetching sprints and issues:', error);
            return [];
        }
    };

    const handleProjectChange = async (e) => {
        const selectedProjectKey = e.target.value;
        setSelectedProjectKey(selectedProjectKey);
        const board1 = await board();
        
        if (selectedProjectKey) {
            
                    const sprintsAndIssues = await fetchSprintsAndIssues(155);
                    setSprintsAndIssues(sprintsAndIssues);
                
            
        }
    };

    return (
        <div>
            <label>
                Select Project:
                <select value={selectedProjectKey} onChange={handleProjectChange}>
                    <option value="">Select a project</option>
                    {projects.map((proj) => (
                        <option key={proj.key} value={proj.key}>
                            {proj.name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <h2>Sprints and Issues</h2>
            <div>
                {sprintsAndIssues.map((sprintAndIssues, index) => (
                    <div key={index}>
                        <h3>Sprint {sprintAndIssues.sprintId}</h3>
                        <ul>
                            {sprintAndIssues.issueKeys.map((issueKey, index) => (
                                <li key={index}>{issueKey}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;



