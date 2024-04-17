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
    const [boardIds, setBoardIds] = useState([]);
    const [sprintIds, setsprintIds] = useState([]);
        const [sprintsIssues, setSprintsIssues] = useState([]);
        const [unique, setunique] = useState([]);

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

   
  
  useEffect(() => {
        if (selectedProjectKey) {
            fetchSprintsAndIssues(selectedProjectKey);
        }
    }, [selectedProjectKey]);

    const fetchSprintsAndIssues = async (selectedProjectKey) => {
        try {
            const response = await requestJira(`/rest/agile/1.0/board?projectKeyOrId=${selectedProjectKey}`, {
                headers: {
                    'content-type': 'application/json'
                }
            });
            const boardsData = await response.json();
            const boardIds = boardsData.values.map(board => board.id);
            console.log("boardIds",boardIds);
            setBoardIds(boardIds);
             for (const boardId of boardIds) {
             console.log("boardId",boardId);
             fetchSprintsForBoard(boardId);
             }
            // Now you have the boardIds, you can proceed with further logic
        } catch (error) {
            console.error("Error fetching sprints and issues:", error);
        }
    };

   const fetchSprintsForBoard = async (boardId) => {
   
        try {
            const response = await requestJira(`/rest/agile/1.0/board/${boardId}/sprint`, {
                headers: {
                    'content-type': 'application/json'
                }
            });
            const sprintsData = await response.json();
            //const sprintIds = sprintsData.values.map(sprint => sprint.id);
            const sIds = sprintsData.values.map(sprint => sprint.id);
	    setsprintIds(sIds);
            console.log("sprintIds",sIds);
            console.log("sprintsData",sprintsData);
            for (const Id of sIds) {
             console.log("boardId",Id);
             fetchSprintsIssues(Id);
             }
            // Now you have the sprints data, you can handle it accordingly
        } catch (error) {
            console.error("Error fetching sprints:", error);
        }
    };

   console.log("sprintIds outside",sprintIds);
   
     const fetchSprintsIssues = async (sprintId) => {
   
        try {
            const response = await requestJira(`/rest/agile/1.0/sprint/${sprintId}/issue`, {
                headers: {
                    'content-type': 'application/json'
                }
            });
            const sprintsData = await response.json();
            console.log("sprintsData",sprintsData);
            setSprintsIssues(prevState => [...prevState, { sprintId: sprintId, issues: sprintsData.issues }]);
            //console.log("sprintsIssues",sprintsIssues);  
        } catch (error) {
            console.error("Error fetching sprints:", error);
        }
    };
  console.log("sprintsIssues",sprintsIssues); 
 
    const handleProjectChange = async (e) => {
        const selectedProjectKey = e.target.value;
        setSelectedProjectKey(selectedProjectKey);
        //const board1 = await board();
        
        /*if (selectedProjectKey) {
            
                    const sprintsAndIssues = await fetchSprintsAndIssues(155);
                    setSprintsAndIssues(sprintsAndIssues);
                
            
        }*/
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
            <table>
                <thead>
                    <tr>
                        <th>Sprint ID</th>
                        <th>Issues</th>
                    </tr>
                </thead>
                <tbody>
                    {sprintsIssues.map((sprintsIssues, index) => (
                        sprintsIssues.issues.map((issue, i) => (
                            <tr key={index + '-' + i}>
                                <td>{sprintsIssues.sprintId}</td>
                                <td>{issue.key}</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default App;

