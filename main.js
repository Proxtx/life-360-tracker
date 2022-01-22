import { config } from "./config.js";
import { syncObj } from "./data.js";
import life360 from "life360-node-api";

let client = await life360.login(config.email, config.password);

let circles = await client.listCircles();

for (const circle of circles) {
  console.log(circle.name);
}

let myCircle = circles[config.circleIndex ? config.circleIndex : 0];

let locations;
let data;
let runObj = { run: true };

const fileLoop = async (fileLoad) => {
  while (true) {
    runObj = { run: true };
    locations = await syncObj(
      "locations/" + Date.now() + ".json",
      5000,
      runObj
    );
    data = await syncObj("data/" + Date.now() + ".json", 5000, runObj);
    fileLoad();
    await new Promise((r) => setTimeout(r, config.fileChangeInterval));
    runObj.run = false;
  }
};

await new Promise((r) => fileLoop(r));

const dataLoop = async () => {
  while (true) {
    console.log("Data update");
    let members = await myCircle.listMembers();
    let date = Date.now();
    data[date] = {};

    for (const member of members) {
      data[date][member.id] = {
        features: member.features,
        issues: member.issues,
        location: {
          latitude: member.location.latitude,
          longitude: member.location.longitude,
          accuracy: member.location.accuracy,
          startTimestamp: member.location.startTimestamp,
          endTimestamp: member.location.endTimestamp,
          since: member.location.since,
          timestamp: member.location.timestamp,
          name: member.location.name,
          placeType: member.location.placeType,
          source: member.location.source,
          sourceId: member.location.sourceId,
          address1: member.location.address1,
          address2: member.location.address2,
          shortAddress: member.location.shortAddress,
          inTransit: member.location.inTransit,
          tripId: member.location.tripId,
          deriveSDKStatus: member.location.deriveSDKStatus,
          battery: member.location.battery,
          charge: member.location.charge,
          wifiState: member.location.wifiState,
          speed: member.location.speed,
          isDriving: member.location.isDriving,
          userActivity: member.location.userActivity,
        },
        communications: member.communications,
        medical: member.medical,
        relation: member.relation,
        createdAt: member.createdAt,
        activity: member.activity,
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        isAdmin: member.isAdmin,
        pinNumber: member.pinNumber,
        loginEmail: member.loginEmail,
        loginPhone: member.loginPhone,
      };
    }
    await new Promise((r) => setTimeout(r, config.fullDataInterval));
  }
};

const locationLoop = async () => {
  while (true) {
    console.log("Location Update");
    let members = await myCircle.listMembers();
    let date = Date.now();
    locations[date] = {};

    for (const member of members) {
      locations[date][member.id] = {
        latitude: member.location.latitude,
        longitude: member.location.longitude,
        address: member.location.address1,
      };
    }
    await new Promise((r) => setTimeout(r, config.locationInterval));
  }
};

dataLoop();
locationLoop();
