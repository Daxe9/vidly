const request = require("supertest");
const { Genre } = require("../../models/genre-model");
const { User } = require("../../models/user-model");
let server;
describe("/api/genres", () => {
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        server.close();
        await Genre.remove({});
    });
    describe("GET /", () => {
        it("should return all genres", async () => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" },
                { name: "genre3" },
            ]);

            const res = await request(server).get("/api/genres");
            // too generic
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
            expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
            expect(res.body.some((g) => g.name === "genre3")).toBeTruthy();
        });
    });

    describe("GET /:id", () => {
        it("should return a single genre with given id(valid)", async () => {
            // create a new genre
            const aGenre = new Genre({
                name: "genre1",
            });

            // store it in the database
            await aGenre.save();
            // GET request to get the information from the server
            const res = await request(server).get(`/api/genres/${aGenre._id}`);
            // get the name from body of the response
            // expect the name got from body contains Horror
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", aGenre.name);
        });
        it("should return 404 response", async () => {
            const res = await request(server).get("/api/genres/1");
            expect(res.status).toBe(404);
        });
    });

    describe("POST /", () => {
        it("should return a 401 if client is not logged in", async () => {
            const res = await request(server)
                .post("/api/genres")
                .send({ name: "genre1" });
            expect(res.status).toBe(401);
        });

        it("should return 400 if genre is invalid because the minimium required characters are 5", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: 1234 });
            expect(res.status).toBe(400);
        });

        it("should return 400 if genre is invalid because the maximium required character are 50", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({
                    name: new Array(60).join("a"),
                });
            expect(res.status).toBe(400);
        });

        it("should save the genre if it's valid", async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: "genre1" });
            const genre = await Genre.find({ name: "genre1" });
            expect(genre).not.toBeNull();
        });

        it("should return the genre if it's valid", async () => {
            const token = new User().generateAuthToken();
            const name = "genre1";
            const res = await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name });

            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", name);
        });
    });
    describe("PUT", () => {});
    describe("DELETE", () => {});
});
