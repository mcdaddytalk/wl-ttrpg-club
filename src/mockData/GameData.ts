import { GMGameSchedule, Player } from "@/lib/types/custom";

export const mockScheduledGames: GMGameSchedule[] = [
    {
        id: "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
        title: "Game 1",
        system: "DND 5e",
        interval: "bimonthly",
        dow: "sunday",
        scheduled_next: new Date(),
        maxSeats: 8,
        registered: 8,
        status: "scheduled"
    },
    {
        id: "fa87bec6-bb03-46f4-899d-b5674634395f",
        title: "Game 2",
        system: "PF2e",
        interval: "weekly",
        dow: "thursday",
        scheduled_next: new Date(),
        maxSeats: 6,
        registered: 0,
        status: "awaiting-players"
    },
    {
        id: "3bd8219f-c1e3-4cab-ba25-fc4803a77dcc",
        title: "Game 3",
        system: "DND 5e",
        interval: "bimonthly",
        dow: "wednesday",
        scheduled_next: new Date(),
        maxSeats: 6,
        registered: 4,
        status: "awaiting-players"
    },
    {
        id: "83e2f7f4-5b5d-4b6b-8a0e-4f1b2c3d4e5f",
        title: "Game 4",
        system: "DND 5e",
        interval: "bimonthly",
        dow: "wednesday",
        scheduled_next: new Date(),
        maxSeats: 6,
        registered: 6,
        status: "scheduled" 
    },
    {
        id: "2d6eb983-9c3a-416f-a01b-23a0a47bef04",
        title: "Game 5",
        system: "DND 5e",
        interval: "bimonthly",
        dow: "wednesday",
        scheduled_next: new Date(),
        maxSeats: 6,
        registered: 6,
        status: "scheduled" 
    },
    {
        id: "7f2eb983-9c3a-416f-a01b-23a0a47bef04",
        title: "Game 6",
        system: "DND 5e",
        interval: "bimonthly",
        dow: "wednesday",
        scheduled_next: new Date(),
        maxSeats: 6,
        registered: 6,
        status: "scheduled" 
    }
];

export const mockPlayers: Player[] = [
    {
        id: "5d6eb983-9c3a-416f-a01b-23a0a47bef04",
        email: "Y0l0U@example.com",
        phoneNumber: "123-456-7890",
        givenName: "John",
        surname: "Doe",
        avatar: "https://example.com/avatar.jpg",
        isMinor: true,
        experienceLevel: "new"
    },
    {
        id: "fa87bec6-bb03-46f4-899d-b5674634395f",
        email: "tKb5U@example.com",
        phoneNumber: "987-654-3210",
        givenName: "Jane",
        surname: "Doe",
        avatar: "https://example.com/avatar.jpg",
        isMinor: false,
        experienceLevel: "seasoned"
    },
    {
        id: "3bd8219f-c1e3-4cab-ba25-fc4803a77dcc",
        email: "Y0l0U@example.com",
        phoneNumber: "123-456-7890",
        givenName: "Felix",
        surname: "Waldorf",
        avatar: "https://example.com/avatar.jpg",
        isMinor: false,
        experienceLevel: "new"
    },
    {
        id: "5ce366cb-7cb1-4a38-8d81-fc342f333362",
        email: "Y0l0U@example.com",
        phoneNumber: "123-456-7890",
        givenName: "Bob",
        surname: "Douglas",
        avatar: "https://example.com/avatar.jpg",
        isMinor: false,
        experienceLevel: "new"
    },
    {
        id: "b3a7ed06-ed14-4cfe-9a9c-8e51a2edf4ca",
        email: "tKb5U@example.com",
        phoneNumber: "987-654-3210",
        givenName: "Susan B",
        surname: "Anthony",
        avatar: "https://example.com/avatar.jpg",
        isMinor: false,
        experienceLevel: "seasoned"
    },
    {
        id: "b3a7ed06-ed14-4cfe-9a9c-8e51a2edf4ca",
        email: "tKb5U@example.com",
        phoneNumber: "987-654-3210",
        givenName: "Elyssa",
        surname: "Jackson",
        avatar: "https://example.com/avatar.jpg",
        isMinor: true,
        experienceLevel: "novice"
    }
];