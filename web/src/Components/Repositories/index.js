import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from 'services/api';
import './styles.css';

function Repositories() {

  const [repositories, setRepositories] = useState([]);
  const [input, setInput] = useState({title: '', techs: ''});

  useEffect(() => {
    api.get('repositories').then(response =>
      {
        setRepositories(response.data);
      })
  },[]);
  
  function handleChangeInput(event: ChangeEvent<HTMLInputElement>){
      const { name, value } = event.target;

      setInput({...input, [name]: value});
  }
  
  async function handleAddRepository() {
    const {title, techs } = input;
    const urlTitle = title.trim();
    const newData = {
      title,
      techs,
      url: `repository/${urlTitle}`,
      likes: 0
    }

    const post = await api.post('repositories', newData);
    const repository = post.data;
    setRepositories([...repositories, repository]);
  }
  
  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);
    
    const updateRepositories = repositories.filter((repository) => repository.id !== id);
    
    setRepositories(updateRepositories);
  }

  async function handleLikeRepository(id){
    const likeAdd = await api.post(`repositories/${id}/like`,{
      like: +1,
    });

    const repositoryLike = likeAdd.data;

    const updateRepository = repositories.map((repos => {
      if(repos.id === id){
        return repositoryLike;
      }else{
        return repos;
      }
    }));

    setRepositories(updateRepository);
  }


  return (
    <>
    <div id="addRepository">
      <form id="addForm" onSubmit={handleAddRepository}>
        <label htmlFor="title">Título</label>
        <input type="text" name="title" onChange={handleChangeInput}/>
        <label htmlFor="techs">Tecnologias</label>
        <input type="text" name="techs" onChange={handleChangeInput}/>
        <button type="submit">Adicionar Repositório</button>
      </form>
    </div>
    <div id="list">
      <ul data-testid="repository-list">
        {repositories.map(repositories => <li key={repositories.id}>
          <div id="texts">
            <h1>{repositories.title}</h1>
            <h2>{repositories.techs}</h2>
          </div>
            <a href={repositories.url}>{repositories.url}</a>
            <h3>👍🏻{repositories.likes}</h3>
          <div id="buttons">
            <button name="like" onClick={() => handleLikeRepository(repositories.id)}>
            👍🏻 Like
            </button>
            <button name="delete" onClick={() => handleRemoveRepository(repositories.id)}>
              Remover
            </button>
          </div>
        </li>)}
        {repositories < 1 && <p>Sem repositórios</p>}
      </ul>
    </div>
    </>
  );
}

export default Repositories;
