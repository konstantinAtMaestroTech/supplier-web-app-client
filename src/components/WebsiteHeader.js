import logo from './favicon.ico';
import axios from 'axios';
import React, { useState, useEffect } from 'react';



export default function WebsiteHeader({value, setProfile, selectedProfile, setProject, setURN}) {
  return (
    <div className="WebsiteHeader">
      <Logo />
      <Selector value={value} setProfile={setProfile} selectedProfile={selectedProfile} setProject={setProject} setURN={setURN} />
    </div>
  );
}

function Logo() {
  return (
    <div className="Logo">
      <img src={logo} alt="Maestro Logo" />
    </div>
  );
}

function Selector({value, setProfile, selectedProfile, setProject, setURN}) {
  return (
    <div className="Selector">
      <ProjectSelector selectedProfile={selectedProfile} setProject={setProject} setURN={setURN}/>
      <ProfileSelector value={value} setProfile={setProfile}/>
      <LogOutSelector />
    </div>
  );
}

function ProjectSelector({selectedProfile, setProject, setURN}) {

  const [projects, setProjects] = useState([]);
  const url = 'http://13.53.130.105:3001/getData/projects';

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await axios.get(url, {headers: {'SelectedSupplier': selectedProfile}});
        let projects = response.data.data.map(project => project); // Needs to be tested with multiple projects.
        setProjects(projects);
      }catch (error){
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, [selectedProfile]);

  return (
    <select className="ProjectSelector" onChange={e => {
      const projectName = e.target.value;
      const project = projects.find(p => p.ProjectName === projectName);
      if (project) {
        setProject(projectName);
        setURN(project.URN);
      }
    }}>
      <option value="">Select a project</option>
      {projects && projects.length > 0 ? (
        projects.map((project, index) => (
          <option key={index} value={project.ProjectName}>
            {project.ProjectName}
          </option>
        ))
      ) : (
        <option disabled>Loading projects...</option>
      )}
    </select>
  );
}

function ProfileSelector({value, setProfile}) {
  return (
    <select className="ProfileSelector" onChange={e => setProfile(e.target.value)}>
      <option value="">Select a profile</option>
        {value.map((v, index) => (
          <option key={index} value={v}>
            {v}
          </option>
        ))}
    </select>
  );
}

function LogOutSelector () {
  return (
    <button className="LogOutSelector">
      Log Out
    </button>
  );
}