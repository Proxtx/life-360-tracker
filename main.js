import { config } from "./config.js";
import { syncObj } from "./data.js";
import { Life360 } from "./life360.js";

let client = new Life360(
  "https://api-cloudfront.life360.com/v3",
  config.email,
  config.password,
  config.circleId
);

await client.init();

// let circles = await client.listCircles();

//for (const circle of circles) {
//console.log(circle.name);
//}

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
    while (!(await dataSave())) {}
    fileLoad();
    await new Promise((r) => setTimeout(r, config.fileChangeInterval));
    runObj.run = false;
  }
};

const dataSave = async () => {
  console.log("[" + new Date().toISOString() + "] " + "Data update");
  try {
    let members = await client.getMembers();
    let date = Date.now();
    data[date] = {};

    for (const member of members) {
      try {
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
          avatar: member.avatar,
        };
      } catch (e) {
        //Member Data error
      }
    }
    return true;
  } catch (e) {
    console.log(e);
    console.log(
      "[" + new Date().toISOString() + "] " + "Data Update failed retry in 15s"
    );
    return false;
  }
};

const dataLoop = async () => {
  while (true) {
    let result = await dataSave();
    if (result)
      await new Promise((r) => setTimeout(r, config.fullDataInterval));
    else await new Promise((r) => setTimeout(r, 15000));
  }
};

await new Promise((r) => fileLoop(r));

const locationLoop = async () => {
  while (true) {
    console.log("[" + new Date().toISOString() + "] " + "Location Update");
    try {
      let members = await client.getMembers();
      let date = Date.now();
      locations[date] = {};

      for (const member of members) {
        try {
          locations[date][member.id] = {
            latitude: member.location.latitude,
            longitude: member.location.longitude,
            address: member.location.name,
          };
        } catch (e) {
          //member data error
        }
      }
      await new Promise((r) => setTimeout(r, config.locationInterval));
    } catch (e) {
      console.log(
        "[" +
          new Date().toISOString() +
          "] " +
          "Location Update failed retry in 15s"
      );
      await new Promise((r) => setTimeout(r, 15000));
    }
  }
};

dataLoop();
locationLoop();
