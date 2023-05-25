const DB = require('../../config/database')

const wishList = {
  add: async (req, res) => {
    const { gameId } = req.body

    const { id } = req.user

    const connection = await DB.getConnection()

    try {
      await connection.beginTransaction()

      const [wishListExists] = await connection.query(
        `SELECT * FROM wishlists WHERE customer_id = ?`,
        [id],
      )

      // return res.status(200).json(wishListExists[0])
      if (wishListExists.length == 0) {
        const [wishListsInsert] = await connection.query(
          `INSERT INTO wishlists (customer_id) VALUES (?)`,
          [id],
        )

        const { insertId: wishListId } = wishListsInsert

        await connection.query(
          `INSERT INTO wishItems (wishlist_id, game_id) VALUES (?, ?)`,
          [wishListId, gameId],
        )
      } else {
        const { id: wishListId } = wishListExists[0]

        const [wishItemExists] = await connection.query(
          `SELECT * FROM  ${process.env.DATABASE_NAME}.wishItems WHERE wishlist_id = ? AND game_id = ?`,
          [wishListId, gameId],
        )

        if (wishItemExists.length == 0) {
          await connection.query(
            `INSERT INTO  ${process.env.DATABASE_NAME}.wishItems (wishlist_id, game_id) VALUES (?, ?)`,
            [wishListId, gameId],
          )
        } else {
          return res.status(400).json({ msg: 'Game already exists in wishlist' })
        }
      }

      await connection.commit()
      return res.status(200).json({ msg: 'Game added to wishlist' })
    } catch (error) {
      console.error(error)

      // Rollback the transaction if an error occurs
      if (connection) {
        await connection.rollback()
      }

      return res.status(500).json({ msg: 'Server Error' })
    } finally {
      // Release the connection back to the pool
      if (connection) {
        connection.release()
      }
    }
  },
  remove: async (req, res) => {
    const { gameId } = req.body

    const { id } = req.user

    const connection = await DB.getConnection()

    try {
      await connection.beginTransaction()

      const [wishlistExists] = await connection.query(
        `SELECT * FROM ${process.env.DATABASE_NAME}.wishlists WHERE customer_id = ?`,
        [id]
      )

      if (wishlistExists.length == 0) {
        return res.status(400).json({ msg: 'Wishlist does not exist' })
      } else {
        const { id: wishItemId } = wishlistExists[0]

        const [wishItemExists] = await connection.query(
          `SELECT * FROM ${process.env.DATABASE_NAME}.wishItems WHERE wishlist_id = ? AND game_id = ?`,
          [wishItemId, gameId]
        )

        if (wishItemExists.length > 0) {
          await connection.query(
            `DELETE FROM ${process.env.DATABASE_NAME}.wishItems WHERE wishlist_id = ? AND game_id = ?`,
            [wishItemId, gameId],
          )
        }
        else {
          res.status(400).json({ msg: 'Game Do not exists in wishlist' })
        }
      }

      await connection.commit()
      return res.status(200).json({ msg: 'Game removed from wishlist' })

    } catch (error) {
      console.log(error)

      if (connection) {
        await connection.rollback()
      }

      return res.status(500).json({ msg: 'Server Error' })
    } finally {
      if (connection) {
        connection.release()
      }
    }
  },
}

module.exports = wishList
