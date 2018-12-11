let request = require("supertest");
let chai = require("chai");
let should = chai.should();

let server = require("../src/server/server");

describe("API tests", () => {
  it("should be able the react app from /", done => {
    request(server)
      .get("/")
      .expect("Content-Type", "text/html")
      .expect(200)
      .end(() => {
          done();
      })
  });

  it("should be able to GET /fps", done => {
    request(server)
      .get("/fps")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(error, response) {
        if (error) done(error);
        response.body.averageFPS.should.be.a("number");
        done();
      });
  });

  it("should be able to GET /acts", done => {
    request(server)
      .get("/acts")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(error, response) {
        if (error) done(error);
        response.body.acts.should.be.an("array");
        response.body.acts[0].should.be.a("string");
        done();
      });
  });

  it("should be able to GET /acts/:actID", done => {
    request(server)
      .get("/acts/A4")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(error, response) {
        if (error) done(error);
        response.body.worlds.should.be.an("array");
        response.body.worlds[0].should.be.a("string");
        done();
      });
  });

  it("should be able to GET /acts/:actID/fps", done => {
    request(server)
      .get("/acts/A4/fps")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(error, response) {
        if (error) done(error);
        response.body.averageFPS.should.be.a("number");
        done();
      });
  });

  it("should be able to GET /acts/:actID/worlds/:worldID/fps", done => {
    request(server)
      .get("/acts/A4/worlds/a4dun_Diablo_ShadowRealm_01/fps")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(error, response) {
        if (error) done(error);
        response.body.averageFPS.should.be.a("number");
        done();
      });
  });
});
