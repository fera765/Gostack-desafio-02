const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function middlewareUUID(request, response, next){
   const {id} = request.params;

   if(!isUuid(id)){
     return response.status(400).json({ msg: 'Repository invalid ID'})
   }

   return next();
}

app.use('/repositories/:id', middlewareUUID)

app.get("/repositories", (request, response) => {
  const {title} = request.query;

  const repositorie = title 
    ? repositories.filter(repo => repo.title.toUpperCase().includes(title.toUpperCase()))
    : repositories;
  return response.json(repositorie)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repositorie)

  return response.json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repo => repo.id == id);

  if(repositorieIndex < 0){
    return response.status(400).json({ msg: 'Repository not found!'})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes
  }

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositorieIndex = repositories.findIndex(repo => repo.id == id);

  if(repositorieIndex < 0){
    return response.status(400).json({ msg: 'Repository not found!'})
  }

  repositories.splice(repositorieIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositorieIndex = repositories.findIndex(repo => repo.id == id);

  if(repositorieIndex < 0){
    return response.status(400).json({ msg: 'Repository not found!'})
  }

  repositories[repositorieIndex].likes += 1;
  
  //return response.json(repositories[repositorieIndex])
  return response.status(204).send()

});

module.exports = app;
