const DB = require('../../config/database');


const info = {
    getOne: async (req, res) => {
        const { id, username, email, phone } = req.query;

        try {
            const [result] = await DB.query(
                `SELECT u.id,
                    u.username,
                    u.display_name,
                    u.email,
                    u.phone,
                    u.address,
                    u.total_points,
                    u.subscription_status
             From ${process.env.DATABASE_NAME}.Users u
             WHERE username = ? OR email = ? OR id = ? OR phone = ?
            `,
                [username, email, id, phone]
            )

            if (result.length === 0) {
                return res.status(404).json({ msg: "user not found" })
            }

            return res.status(200).json(result[0])

        } catch (error) {
            return res.status(500).json({ msg: 'Error Server' })
        }

    },
    update: async (req, res) => {
        const { id } = req.query;

        try {
            //   find user
            const [userExist] = await DB.query(
                `SELECT * FROM ${process.env.DATABASE_NAME}.Users WHERE id = ?`,
                [id]
            )

            if (userExist.length === 0) {
                return res.status(404).json({ msg: "User not found" });
            }
            //   Update info
            const json = req.body;

            const keyList = Object.keys(json);

            const queryUpdate = keyList.map(key => {
                return `${key} = '${json[key]}'`
            }).join(',')

            const query = `
            UPDATE ${process.env.DATABASE_NAME}.Users
            SET ${queryUpdate}
            WHERE id = ${id}
            `;

            const result = await DB.query(query);

            return res.status(200).json({ msg: "User updated successfully" });
        } catch (error) {
            console.error(error); // Log the error for debugging purposes
            return res.status(500).json({ msg: "Server error" });
        }
    },
    createCustomerInfo: async (req, res) => {
        const { username } = req.user;

        const json = req.body;

        const keyList = Object.keys(json);

        const queryInsert = keyList.map(key => {
            return `${key}`
        }).join(',')

        const valueList = keyList.map(key => {
            return `'${json[key]}'`
        }).join(',')

        const query = `
            INSERT INTO ${process.env.DATABASE_NAME}.Users (${queryInsert})
            VALUES (${valueList})
        `;

        try {
            const result = await DB.query(query);

            const { insertId } = result[0]
            return res.status(200).json({ msg: 'Create successfully', data: {
                id: insertId
            } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Server Error' });
        }

    }

}



module.exports = info;

