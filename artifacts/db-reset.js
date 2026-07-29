#!/usr/bin/env nodejs

"use strict";

// This script initializes the database. You can set the environment variable
// before running it (default: development). ie:
// NODE_ENV=production node artifacts/db-reset.js

const _ = require("underscore");
const { MongoClient } = require("mongodb");
const { db } = require("../config/config");
const bcrypt = require("bcryptjs");

const USERS_TO_INSERT = [
    {
        "_id": 1,
        "userName": "admin",
        "firstName": "Node Goat",
        "lastName": "Admin",
        "isAdmin": true
    }, {
        "_id": 2,
        "userName": "user1",
        "firstName": "John",
        "lastName": "Doe",
        "benefitStartDate": "2030-01-10"
    }, {
        "_id": 3,
        "userName": "user2",
        "firstName": "Will",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30"
    }];

const hashPassword = async (plaintext) => {
    const saltRounds = 10;
    return await bcrypt.hash(plaintext, saltRounds);
};

// Getting the global config taking in account he environment (proc)

const parseResponse = (err, res, comm) => {
    if (err) {
        console.log("ERROR:");
        console.log(comm);
        console.log(JSON.stringify(err));
        process.exit(1);
    }
    console.log(comm);
    console.log(JSON.stringify(res));
}


// Starting here
MongoClient.connect(db, async (err, db) =>  {
    if (err) {
        console.log("ERROR: connect");
        console.log(JSON.stringify(err));
        process.exit(1);
    }
    console.log("Connected to the database: " + db);

    // remove existing data (if any), we don't want to look for errors here
    db.dropCollection("users");
    db.dropCollection("allocations");
    db.dropCollection("contributions");
    db.dropCollection("memos");

    // Hash passwords before insertion
    USERS_TO_INSERT[0].password = await hashPassword("Admin_123");
    USERS_TO_INSERT[1].password = await hashPassword("User1_123");
    USERS_TO_INSERT[2].password = await hashPassword("User2_123");
    db.dropCollection("counters");

    const usersCol = db.collection("users");
    const allocationsCol = db.collection("allocations");
    const countersCol = db.collection("counters");

    // reset unique id counter
    countersCol.insert({
        _id: "userId",
        seq: 3
    });

    // insert admin and test users
    console.log("Users to insert:");
    USERS_TO_INSERT.forEach((user) => console.log(JSON.stringify(user)));

    usersCol.insertMany(USERS_TO_INSERT, (err, data) => {
        const finalAllocations = [];

        // We can't continue if error here
        if (err) {
            console.log("ERROR: insertMany");
            console.log(JSON.stringify(err));
            process.exit(1);
        }
        parseResponse(err, data, "users.insertMany");

        data.ops.forEach((user) => {
            const stocks = Math.floor((Math.random() * 40) + 1);
            const funds = Math.floor((Math.random() * 40) + 1);

            finalAllocations.push({
                userId: user._id,
                stocks: stocks,
                funds: funds,
                bonds: 100 - (stocks + funds)
            });
        });

        console.log("Allocations to insert:");
        finalAllocations.forEach(allocation => console.log(JSON.stringify(allocation)));

        allocationsCol.insertMany(finalAllocations, (err, data) => {
            parseResponse(err, data, "allocations.insertMany");
            console.log("Database reset performed successfully")
            process.exit(0);
        });

    });
});
