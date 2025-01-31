import { GMGameData, Player } from "@/lib/types/custom";

export const mockScheduledGames: GMGameData[] = [
    {
        "id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
        "title": "Game 1",
        "description": "Game 1 is a thrilling DND 5e adventure that happens every biweekly on sundays. Join us for an exciting journey!",
        "system": "DND 5e",
        "interval": "biweekly",
        "dow": "sunday",
        "scheduled_next": new Date("2024-11-30T20:20:42.481248"),
        "pending": 2,
        "maxSeats": 8,
        "registered": 6,
        "status": "scheduled",
        "location_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
        "location": {
            "id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
            "name": "My Home",
            "address": "123 Main St, Anytown, USA",
            "type": "physical",
            "scope": "disabled",
            "created_at": new Date("2024-11-30T20:20:42.481248"),
            "updated_at": new Date("2024-11-30T20:20:42.481248"),
            "created_by": "5d6eb983-9c3a-416f-a01b-23a0a47bef04"
        }
    },
    {
        "id": "fa87bec6-bb03-46f4-899d-b5674634395f",
        "title": "Game 2",
        "description": "Game 2 is a thrilling PF2e adventure that happens every weekly on thursdays. Join us for an exciting journey!",
        "system": "PF2e",
        "interval": "weekly",
        "dow": "thursday",
        "scheduled_next": new Date("2024-11-24T20:20:42.481265"),
        "pending": 0,
        "maxSeats": 6,
        "registered": 0,
        "status": "awaiting-players",
        "location_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
        "location": {
            "id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
            "name": "My Home",
            "address": "123 Main St, Anytown, USA",
            "type": "physical",
            "scope": "disabled",
            "created_at": new Date("2024-11-30T20:20:42.481248"),
            "updated_at": new Date("2024-11-30T20:20:42.481248"),
            "created_by": "5d6eb983-9c3a-416f-a01b-23a0a47bef04"
        }
    },
    {
        "id": "3bd8219f-c1e3-4cab-ba25-fc4803a77dcc",
        "title": "Game 3",
        "description": "Game 3 is a thrilling DND 5e adventure that happens every biweekly on wednesdays. Join us for an exciting journey!",
        "system": "DND 5e",
        "interval": "biweekly",
        "dow": "wednesday",
        "scheduled_next": new Date("2024-11-26T20:20:42.481270"),
        "pending": 3,
        "maxSeats": 6,
        "registered": 4,
        "status": "awaiting-players",
        "location_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
        "location": {
            "id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
            "name": "My Home",
            "address": "123 Main St, Anytown, USA",
            "type": "physical",
            "scope": "disabled",
            "created_at": new Date("2024-11-30T20:20:42.481248"),
            "updated_at": new Date("2024-11-30T20:20:42.481248"),
            "created_by": "5d6eb983-9c3a-416f-a01b-23a0a47bef04"
        }
    },
    {
        "id": "83e2f7f4-5b5d-4b6b-8a0e-4f1b2c3d4e5f",
        "title": "Game 4",
        "description": "Game 4 is a thrilling DND 5e adventure that happens every biweekly on wednesdays. Join us for an exciting journey!",
        "system": "DND 5e",
        "interval": "biweekly",
        "dow": "wednesday",
        "scheduled_next": new Date("2024-11-28T20:20:42.481274"),
        "pending": 0,
        "maxSeats": 6,
        "registered": 6,
        "status": "scheduled",
        "location_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
        "location": {
            "id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
            "name": "My Home",
            "address": "123 Main St, Anytown, USA",
            "type": "physical",
            "scope": "disabled",
            "created_at": new Date("2024-11-30T20:20:42.481248"),
            "updated_at": new Date("2024-11-30T20:20:42.481248"),
            "created_by": "5d6eb983-9c3a-416f-a01b-23a0a47bef04"
        }
    },
    {
        "id": "2d6eb983-9c3a-416f-a01b-23a0a47bef04",
        "title": "Game 5",
        "description": "Game 5 is a thrilling DND 5e adventure that happens every biweekly on wednesdays. Join us for an exciting journey!",
        "system": "DND 5e",
        "interval": "biweekly",
        "dow": "wednesday",
        "scheduled_next": new Date("2024-12-01T20:20:42.481277"),
        "pending": 0,
        "maxSeats": 6,
        "registered": 6,
        "status": "scheduled",
        "location_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
        "location": {
            "id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
            "name": "My Home",
            "address": "123 Main St, Anytown, USA",
            "type": "physical",
            "scope": "disabled",
            "created_at": new Date("2024-11-30T20:20:42.481248"),
            "updated_at": new Date("2024-11-30T20:20:42.481248"),
            "created_by": "5d6eb983-9c3a-416f-a01b-23a0a47bef04"
        }
    }
];

export const mockPlayers: Player[] = [
    {
        "id": "f3582828-2ac2-40c1-b4de-1ed8ef1d4cc1",
        "email": "john.doe@example.com",
        "phoneNumber": "123-456-7890",
        "given_name": "John",
        "surname": "Doe",
        "avatar": "https://example.com/john_avatar.jpg",
        "isMinor": true,
        "experienceLevel": "new",
        "status": "pending",
        "statusNote": "Pending approval"
    },
    {
        "id": "1e6a3116-470f-4c2e-a24a-cade0af39a0c",
        "email": "bob.douglas@example.com",
        "phoneNumber": "555-555-5555",
        "given_name": "Bob",
        "surname": "Douglas",
        "avatar": "https://example.com/bob_avatar.jpg",
        "isMinor": false,
        "experienceLevel": "new",
        "status": "pending",
        "statusNote": "Pending approval"
    },
    {
        "id": "de1d6100-e5db-47da-99dc-388d8f6ea082",
        "email": "susan.anthony@example.com",
        "phoneNumber": "444-444-4444",
        "given_name": "Susan",
        "surname": "Anthony",
        "avatar": "https://example.com/susan_avatar.jpg",
        "isMinor": false,
        "experienceLevel": "seasoned",
        "status": "pending",
        "statusNote": "Pending approval"
    },
    {
        "id": "a2a0c3dc-24ab-4886-95d3-0ff6d6ee02cf",
        "email": "jane.doe@example.com",
        "phoneNumber": "987-654-3210",
        "given_name": "Jane",
        "surname": "Doe",
        "avatar": "https://example.com/jane_avatar.jpg",
        "isMinor": false,
        "experienceLevel": "seasoned",
        "status": "pending",
        "statusNote": "Pending approval"
    },
    {
        "id": "d06606a6-1e34-4d2b-bd14-20cf7fa680ce",
        "email": "felix.waldorf@example.com",
        "phoneNumber": "321-654-9870",
        "given_name": "Felix",
        "surname": "Waldorf",
        "avatar": "https://example.com/felix_avatar.jpg",
        "isMinor": false,
        "experienceLevel": "novice",
        "status": "pending",
        "statusNote": "Pending approval"
    },
    {
        "id": "fce373fd-9ec2-4c21-9d7a-6bf524d61653",
        "email": "elyssa.jackson@example.com",
        "phoneNumber": "333-333-3333",
        "given_name": "Elyssa",
        "surname": "Jackson",
        "avatar": "https://example.com/elyssa_avatar.jpg",
        "isMinor": true,
        "experienceLevel": "novice",
        "status": "pending",
        "statusNote": "Pending approval"
    }
];

export const mockRegisteredPlayers = [
    { "game_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "f3582828-2ac2-40c1-b4de-1ed8ef1d4cc1" },
    { "game_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "a2a0c3dc-24ab-4886-95d3-0ff6d6ee02cf" },
    { "game_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "d06606a6-1e34-4d2b-bd14-20cf7fa680ce" },
    { "game_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "de1d6100-e5db-47da-99dc-388d8f6ea082" },
    { "game_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "1e6a3116-470f-4c2e-a24a-cade0af39a0c" },
    { "game_id": "5d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "fce373fd-9ec2-4c21-9d7a-6bf524d61653" },
    { "game_id": "83e2f7f4-5b5d-4b6b-8a0e-4f1b2c3d4e5f", "member_id": "de1d6100-e5db-47da-99dc-388d8f6ea082" },
    { "game_id": "83e2f7f4-5b5d-4b6b-8a0e-4f1b2c3d4e5f", "member_id": "1e6a3116-470f-4c2e-a24a-cade0af39a0c" },
    { "game_id": "83e2f7f4-5b5d-4b6b-8a0e-4f1b2c3d4e5f", "member_id": "d06606a6-1e34-4d2b-bd14-20cf7fa680ce" },
    { "game_id": "83e2f7f4-5b5d-4b6b-8a0e-4f1b2c3d4e5f", "member_id": "fce373fd-9ec2-4c21-9d7a-6bf524d61653" },
    { "game_id": "83e2f7f4-5b5d-4b6b-8a0e-4f1b2c3d4e5f", "member_id": "f3582828-2ac2-40c1-b4de-1ed8ef1d4cc1" },
    { "game_id": "83e2f7f4-5b5d-4b6b-8a0e-4f1b2c3d4e5f", "member_id": "a2a0c3dc-24ab-4886-95d3-0ff6d6ee02cf" },
    { "game_id": "2d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "fce373fd-9ec2-4c21-9d7a-6bf524d61653" },
    { "game_id": "2d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "d06606a6-1e34-4d2b-bd14-20cf7fa680ce" },
    { "game_id": "2d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "f3582828-2ac2-40c1-b4de-1ed8ef1d4cc1" },
    { "game_id": "2d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "de1d6100-e5db-47da-99dc-388d8f6ea082" },
    { "game_id": "2d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "1e6a3116-470f-4c2e-a24a-cade0af39a0c" },
    { "game_id": "2d6eb983-9c3a-416f-a01b-23a0a47bef04", "member_id": "a2a0c3dc-24ab-4886-95d3-0ff6d6ee02cf" }
];
