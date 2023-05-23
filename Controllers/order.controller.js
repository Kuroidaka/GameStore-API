const DB = require('../config/database');

const order = { 
    booking: async (req, res) => {
        const { id } = req.user;
        const { queue_data, rent_duration, gameList } = req.body;
      
        const queryQueueOrder = `
          INSERT INTO QueueBookings (admin_id, book_date, queue_data, rent_duration) 
          VALUES (?, ?, ?, ?);
        `;
        const valueQueueOrder = [id, new Date(), queue_data, rent_duration];
      
        let connection; // Declare a connection variable
      
        try {
          // Get a connection from the pool
          connection = await DB.getConnection();
      
          // Start the transaction
          await connection.beginTransaction();
      
          const result = await connection.query(queryQueueOrder, valueQueueOrder);
          const { insertId: bookingID } = result[0];
      
          for (let i = 0; i < gameList.length; i++) {
            const { id: gameID, discount, price } = gameList[i];
            const queryQueueOrderItem = `
              INSERT INTO BookingItems (game_id, booking_id, discount_value, price)
              VALUES (?, ?, ?, ?)
            `;
            const valueQueueOrderItem = [gameID, bookingID, discount, price];
      
            await connection.query(queryQueueOrderItem, valueQueueOrderItem);
          }
      
          // Commit the transaction
          await connection.commit();
      
          return res.status(200).json({ msg: 'Order Booking successful' });
        } catch (err) {
          console.error(err);
      
          // Rollback the transaction if an error occurs
          if (connection) {
            await connection.rollback();
          }
      
          return res.status(500).json({ msg: 'Server Error' });
        } finally {
          // Release the connection back to the pool
          if (connection) {
            connection.release();
          }
        }
      },
      
    accept: async (req, res) => {
        const { id:userID } = req.user;
            
        const { orderId } = req.query

        try {

            // update queue table status 
            const queryUpdate = `UPDATE QueueBookings SET queue_status = 'DONE' WHERE id = ?`
            const valueUpdate = [orderId]

            await DB.query(queryUpdate, valueUpdate)

            const querySearchOrder = `SELECT * FROM QueueBookings WHERE id = ?`
            const valueQuerySearchOrder = [orderId]
            const [[queueData]] = await DB.query(querySearchOrder, valueQuerySearchOrder)
            
            // insert into rental table
            const bookDate = queueData.book_date
            const rentalEndDate = new Date (bookDate.setDate(bookDate.getDate() + queueData.rent_duration))

            const totalPriceQuery = `
            SELECT bi.booking_id, SUM(bi.price * bi.discount_value) AS total_price
            FROM ${process.env.DATABASE_NAME}.BookingItems bi
            WHERE bi.booking_id = ?
            GROUP BY booking_id;`
            const [[totalPrice]] = await DB.query(totalPriceQuery, [orderId])
        
            const queryInsert = `INSERT INTO Rentals (admin_id, queue_booking_id, rental_start_date, rental_end_date, rental_price) VALUES (?, ?, ?, ?, ?)`;
            const valueInsert = [userID, orderId, new Date(), rentalEndDate, totalPrice.total_price];

            await DB.query(queryInsert, valueInsert)
  
            return res.status(200).json({ msg: 'Order Accepted'})
        } catch (error) {
            console.log(error);
        }

       

    },
    reject: async () => { 

    }

}

module.exports = order