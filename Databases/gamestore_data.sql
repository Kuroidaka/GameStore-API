USE GAMESTORE;

INSERT INTO Games (game_name, release_date, developer, rating, price, genre, platform, description)
VALUES
('Minecraft', '2011-11-18', 'Mojang', 8.5, 29.99, 'Simulation', 'PC,PlayStation,Xbox,Nintendo,Mobile', 'Minecraft is a sandbox video game that allows players to build and explore virtual worlds made out of blocks. It has a survival mode where players must gather resources and maintain their health, and a creative mode where they have unlimited resources to build whatever they want.'),
('Call of Duty Warzone', '2020-03-10', 'Activision', 7.8, 0.00, 'Action', 'PC,PlayStation,Xbox', 'Call of Duty: Warzone is a free-to-play battle royale game that supports up to 150 players. It features a cash-based economy system, allowing players to purchase equipment and revive their teammates. The game is set in the fictional city of Verdansk, which is loosely based on Kastovia, a country featured in previous Call of Duty games.'),
('Grand Theft Auto V', '2013-09-17', 'Rockstar North', 9.0, 29.99, 'Action', 'PC,PlayStation,Xbox', 'Grand Theft Auto V is an action-adventure game set in the fictional city of Los Santos, which is based on Los Angeles. The game features three playable characters, each with their own unique storylines and abilities. It also has an online multiplayer mode, where players can participate in various activities such as heists and races.'),
('Pokemon Legends Arceus', '2022-01-28', 'Game Freak', 0.0, 59.99, 'Role-playing', 'Nintendo', 'Pokemon Legends: Arceus is an upcoming action role-playing game set in the Sinnoh region of the Pokemon world. The game takes place in a feudal era, where players can catch and battle Pokemon while exploring a vast open world.'),
('FIFA 22', '2021-10-01', 'EA Sports', 0.0, 59.99, 'Sports', 'PC,PlayStation,Xbox,Nintendo', 'FIFA 22 is a football simulation game that features various improvements to gameplay, including enhanced ball control and realistic player movements. It also includes new features such as the Create a Club mode, where players can create and customize their own club.'),
('Fortnite', '2017-07-25', 'Epic Games', 7.3, 0.00, 'Action', 'PC,PlayStation,Xbox,Nintendo,Mobile', 'Fortnite is a free-to-play battle royale game where players fight to be the last one standing. The game also has a creative mode, where players can build their own structures and creations.'),
('Half-Life Alyx', '2020-03-23', 'Valve Corporation', 9.1, 59.99, 'Action', 'PC', 'Half-Life: Alyx is a virtual reality first-person shooter game set in the Half-Life universe. The game follows Alyx Vance, a resistance fighter who must battle an alien race known as the Combine. It has been praised for its immersive gameplay and storytelling.'),
('Devil May Cry 5', '2019-03-08', 'Capcom', 8.4,39.99, 'Action', 'PC,PlayStation,Xbox', 'Devil May Cry 5 is an action-adventure hack and slash game that follows three characters, Nero, Dante, and newcomer V, as they battle demons in the fictional city of Red Grave. The game features a variety of weapons and abilities for players to use, as well as a photo mode for capturing and sharing gameplay moments.'),
('Beat Saber', '2018-05-01', 'Beat Games', 9.3, 29.99, 'Rhythm', 'PC,PlayStation,VR', 'Beat Saber is a virtual reality rhythm game where players use lightsabers to slash through blocks to the beat of music. It features various difficulty levels and a custom level editor, allowing players to create and share their own levels. The game has been praised for its addictive gameplay and immersive VR experience.');


INSERT INTO images (filepath)
VALUES
    ('Minecraft.png'),
    ('Call of Duty Warzone.png'),
    ('Grand Theft Auto V.png'),
    ('Pokemon Legends Arceus.png'),
    ('FIFA 22.png'),
    ('Fortnite.png'),
    ('Half-Life Alyx.png'),
    ('Devil May Cry 5.png'),
    ('Beat Saber.png');

INSERT INTO FileLink (fileID, gameID)
SELECT images.id, Games.id
FROM images
JOIN Games ON images.filepath LIKE CONCAT('%', Games.game_name, '%');

