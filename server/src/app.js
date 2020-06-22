const express = require("express");
const cors = require("cors");
const {uuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyId(request, response, next){
    const { id } = request.params;
    const validId = repositories.find(find => find.id === id);

    if(!validId){
      return response.status(400).json({ error: "Repository not found!"});
    }

    return next();
}

app.use("/repositories/:id", verifyId);

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const newRepository = {id: uuid(), title, url, techs, likes: 0};

    repositories.push(newRepository);
    return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repository = repositories.find(find => find.id === id);

    repository.title = title;
    repository.url = url;
    repository.techs = techs;

    return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const repository = repositories.findIndex(find => find.id === id);

    repositories.splice(repository, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    const repository = repositories.find(find => find.id === id);

    repository.likes += 1;

    return response.json(repository)

});

module.exports = app;
