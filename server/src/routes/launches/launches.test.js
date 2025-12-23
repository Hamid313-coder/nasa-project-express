const request = require("supertest");

const app = require("../../app.js");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo.js");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should response with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "SDR 342",
      target: "Kepler-62 f",
      rocket: "REER2323",
      launchDate: "15 March, 2032",
    };

    const launchDataWithoutDate = {
      mission: "SDR 342",
      target: "Kepler-62 f",
      rocket: "REER2323",
    };

    const launchDataWithInvalidDate = {
      mission: "SDR 342",
      target: "Kepler-62 f",
      rocket: "REER2323",
      launchDate: "Boot",
    };

    test("It should response with 201 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).toMatchObject(launchDataWithoutDate);

      const requestDate = Date(completeLaunchData.launchDate).valueOf();
      const responseDate = Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalidate dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
