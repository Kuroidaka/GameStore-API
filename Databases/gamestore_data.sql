USE GAMESTORE;

INSERT INTO Games (id, game_name, release_date, developer, rating, price, genre, platform, description)
VALUES
('49b5f320-4c35-4d27-a87d-96e0ab0b8a5b', 'Minecraft', '2011-11-18', 'Mojang', 8.5, 29.99, 'Simulation', 'PC,PlayStation,Xbox,Nintendo,Mobile', 'Minecraft is a sandbox video game that allows players to build and explore virtual worlds made out of blocks. It has a survival mode where players must gather resources and maintain their health, and a creative mode where they have unlimited resources to build whatever they want.'),
('df7a9260-2262-4b8a-9679-09f11f0ad0e9', 'Call of Duty Warzone', '2020-03-10', 'Activision', 7.8, 0.00, 'Action', 'PC,PlayStation,Xbox', 'Call of Duty: Warzone is a free-to-play battle royale game that supports up to 150 players. It features a cash-based economy system, allowing players to purchase equipment and revive their teammates. The game is set in the fictional city of Verdansk, which is loosely based on Kastovia, a country featured in previous Call of Duty games.'),
('408a071b-5ea1-4a8e-9981-dba6189f8d8e', 'Grand Theft Auto V', '2013-09-17', 'Rockstar North', 9.0, 29.99, 'Action', 'PC,PlayStation,Xbox', 'Grand Theft Auto V is an action-adventure game set in the fictional city of Los Santos, which is based on Los Angeles. The game features three playable characters, each with their own unique storylines and abilities. It also has an online multiplayer mode, where players can participate in various activities such as heists and races.'),
('6be7846c-5b7b-43a4-a8e7-fb4b60ebd9f1', 'Pokemon Legends Arceus', '2022-01-28', 'Game Freak', 0.0, 59.99, 'Role-playing', 'Nintendo', 'Pokemon Legends: Arceus is an upcoming action role-playing game set in the Sinnoh region of the Pokemon world. The game takes place in a feudal era, where players can catch and battle Pokemon while exploring a vast open world.'),
('f86a8e29-4b42-4af7-96d2-6164eb7b3e4d', 'FIFA 22', '2021-10-01', 'EA Sports', 0.0, 59.99, 'Sports', 'PC,PlayStation,Xbox,Nintendo', 'FIFA 22 is a football simulation game that features various improvements to gameplay, including enhanced ball control and realistic player movements. It also includes new features such as the Create a Club mode, where players can create and customize their own club.'),
('4561f705-1b57-4020-8857-2a87d9bc3a4d', 'Fortnite', '2017-07-25', 'Epic Games', 7.3, 0.00, 'Action', 'PC,PlayStation,Xbox,Nintendo,Mobile', 'Fortnite is a free-to-play battle royale game where players fight to be the last one standing. The game also has a creative mode, where players can build their own structures and creations.'),
('e7056172-2e1c-4322-b96e-352a9fb6a1f2', 'Half-Life Alyx', '2020-03-23', 'Valve Corporation', 9.1, 59.99, 'Action', 'PC', 'Half-Life: Alyx is a virtual reality first-person shooter game set in the Half-Life universe. The game follows Alyx Vance, a resistance fighter who must battle an alien race known as the Combine. It has been praised for its immersive gameplay and storytelling.'),
('62c101d4-ffed-4b4e-8b24-61e4de5e41d6', 'Devil May Cry 5', '2019-03-08', 'Capcom', 8.4, 39.99, 'Action', 'PC,PlayStation,Xbox', 'Devil May Cry 5 is an action-adventure hack and slash game that follows three characters, Nero, Dante, and newcomer V, as they battle demons in the fictional city of Red Grave. The game features a variety of weapons and abilities for players to use, as well as a photo mode for capturing and sharing gameplay moments.'),
('a3d81a5f-40f1-442b-82be-5e5e3c6c2207', 'Beat Saber', '2018-05-01', 'Beat Games', 9.3, 29.99, 'Rhythm', 'PC,PlayStation,VR', 'Beat Saber is a virtual reality rhythm game where players use lightsabers to slash through blocks to the beat of music. It features various difficulty levels and a custom level editor, allowing players to create and share their own levels. The game has been praised for its addictive gameplay and immersive VR experience.');

INSERT INTO images (id, filepath)
VALUES
    ('98c3842c-3a50-4e1d-afef-b036450ed1d1', 'Minecraft.png'),
    ('7646ef59-09ff-4851-aa29-cd6924b34ef9', 'Call of Duty Warzone.png'),
    ('157fbf9b-1269-4081-9a5d-7f1d65c7f050', 'Grand Theft Auto V.png'),
    ('2099f876-35ab-407e-93cd-41f974e5e0da', 'Pokemon Legends Arceus.png'),
    ('f12cc5af-9e87-4c2e-bf02-42fbfa282e89', 'FIFA 22.png'),
    ('89203b71-3d3b-48df-8a8e-29ef47b4ed8f', 'Fortnite.png'),
    ('725ae5bb-20b6-474b-87f3-2d9a52076e9a', 'Half-Life Alyx.png'),
    ('32e7a8a7-ae16-4be4-8eac-9f9c3b246b0c', 'Devil May Cry 5.png'),
    ('04f3d3ad-3ff0-4f07-95f9-62c0577e7c79', 'Beat Saber.png');

INSERT INTO FileLink (fileID, gameID)
SELECT images.id, Games.id
FROM images
JOIN Games ON images.filepath LIKE CONCAT('%', Games.game_name, '%');

