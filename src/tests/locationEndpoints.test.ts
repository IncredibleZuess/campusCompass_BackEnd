import request from "supertest";
import mongoose from "mongoose";
import server from "../index.ts";
import app from "../server.ts";
import {describe, it, expect, afterAll, beforeAll, jest } from "@jest/globals";
import Location from "../models/location.ts";

let token: string;


beforeAll(async () => {
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});

describe("Get All Locations", () => {
    it("should return all locations", async () =>{
        const res = await request(app).get("/locations");
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    })
})



function getRandomLocationId() {
    const res = Location.aggregate().sample(1).then(locations => locations[0]._id.toString());
    console.log(res);
    return res;
}


//replace with actual login
function loginAndGetToken() {
    const adminCredentials = {
        username: "test",
        password: "test"
    };
    return request(app)
        .post("/admin/login")
        .send(adminCredentials)
        .then((res) => {
            token = res.body.accessToken; // Save the token for future requests
            return token;
        });
}

loginAndGetToken().then(token => {
    // Use the token for authenticated requests
    console.log("Logged in with token:", token);
});

describe("Get Location by ID", () => {
    it("should return location by ID", async () =>{
        //Get random location from database and use its ID here
        const locationId = await getRandomLocationId();
        const res = await request(app).get(`/locations/${locationId}`);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body._id).toBe(locationId);
    })

    it("should return 404 for non-existing location ID", async () =>{
        const locationId = "68b236b9c19a1d5aece6f77d";
        const res = await request(app).get(`/locations/${locationId}`);
        expect(res.status).toBe(404);
    })
})

describe("Create New Location", () => {
    it("Should error when creating a new location if not logged in", async () =>{
        const newLocation = {
            name: "New Location",
            description: "A new location",
            lat: 123.456,
            lng: 78.910
        };
        const res = await request(app).post("/locations").send(newLocation);
        expect(res.status).toBe(401);
    })
    it("should create a new location if logged in", async () =>{
        jest.setTimeout(10000);
        const newLocation = {
            name: "New Location",
            description: "A new location",
            lat: 123.456,
            lng: 78.910
        };
        const res = await request(app).post("/locations").set("Authorization", `Bearer ${token}`).send(newLocation);
        expect(res.status).toBe(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.name).toBe(newLocation.name);
    })
})

describe("Location API", () => {
    it("should delete a location by ID", async () =>{
        const locationId = await getRandomLocationId();
        const res = await request(app).delete(`/locations/${locationId}`).set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(204);
    })
})

describe("Location API", () => {
    it("should update a location by ID", async () =>{
        const locationId = await getRandomLocationId();
        const updatedLocation = {
            name: "Updated Location",
            description: "An updated location",
            lat: 123.456,
            lng: 78.910
        };
        const res = await request(app).post(`/locations/${locationId}`).set("Authorization", `Bearer ${token}`).send(updatedLocation);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.name).toBe(updatedLocation.name);
    })
})
