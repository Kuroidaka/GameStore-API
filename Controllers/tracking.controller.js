const DB = require('../config/database');

const tracking = { 
    getTrackList: async (req, res) => {

        try {

            const [result] = await DB.query(
                `SELECT 
                    tr.id,
                    tr.admin_id,
                    tr.event_name,
                    tr.action,
                    tr.timestamp,
                    ad.username,
                    ad.email
                FROM ${process.env.DATABASE_NAME}.history_action_track tr
                JOIN ${process.env.DATABASE_NAME}.Admins ad on tr.admin_id = ad.id
                `
            )

            if (result.length === 0) {
                return res.status(404).json({ msg: "Tracking not found" })
            }

            return res.status(200).json(result)

        } catch (error) {
            console.log(error)
            return res.status(500).json({msg : "Error server"})
        }
    },
   
}

module.exports = tracking