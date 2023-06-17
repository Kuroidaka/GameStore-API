const DB = require('../config/database');

const order = { 
    booking: async (req, res) => {
        // const { id } = req.user;
        console.log(req.body)
        const { rent_duration, gameList, discount_applied, address, customerID } = req.body;
        let total_price = 0 

        const queryQueueOrder = `
          INSERT INTO QueueBookings (customer_id, book_date, rent_duration, discount_applied, queue_status, address) 
          VALUES (?, ?, ?, ?, ?, ?);
        `;
        const valueQueueOrder = [customerID, new Date(), rent_duration, discount_applied, 'WAITING', address];
      
        let connection; // Declare a connection variable
      
        try {
          // Get a connection from the pool
          connection = await DB.getConnection();
      
          // Start the transaction
          await connection.beginTransaction();
      
          const result = await connection.query(queryQueueOrder, valueQueueOrder);
          const { insertId: bookingID } = result[0];
      
          for (let i = 0; i < gameList.length; i++) {
            const gameID = gameList[i];

            const queryQueueOrderItem = `
            INSERT INTO BookingItems (game_id, booking_id, price)
            VALUES (${gameID}, ${bookingID}, (SELECT price FROM Games WHERE id = ${gameID}));
            `;

      
            await connection.query(queryQueueOrderItem);
          }

          const [getTotal] = await connection.query(`SELECT SUM(price) AS total_price FROM BookingItems WHERE booking_id = ${bookingID}`);

          // INSERT FINAL PRICE 
    
          const finalPrice = discount_applied ? getTotal[0].total_price * discount_applied : getTotal[0].total_price
      
          const queryInsert = `UPDATE QueueBookings SET rental_price = (${finalPrice}) WHERE id = ${bookingID}`;

          await connection.query(queryInsert);
      
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
      const { id: userID } = req.user;
      const { orderId } = req.query;
    
      let connection; // Declare a connection variable
    
      try {
        // Get a connection from the pool
        connection = await DB.getConnection();
    
        // Start the transaction
        await connection.beginTransaction();
    
        const querySearchOrder = `SELECT * FROM QueueBookings WHERE id = ?`;
        const valueQuerySearchOrder = [orderId];
        const [[queueData]] = await connection.query(querySearchOrder, valueQuerySearchOrder);
    
        // update rental status
        const bookDate = queueData.book_date;
        const rentalEndDate = new Date(bookDate.setDate(bookDate.getDate() + queueData.rent_duration));
        
        const queryInsert = `UPDATE QueueBookings 
        SET queue_status = ? , 
        rental_end_date= ?  , 
        rental_start_date =  ?   
        WHERE id = ${orderId}`;

        await connection.query(queryInsert, ['DONE', rentalEndDate, new Date()]);
        
        // Commit the transaction
        await connection.commit();

        // return res.status(200).json({ msg: 'Order Accepted' });
      } catch (error) {
        console.log(error);
    
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
    reject: async (req, res) => { 
      const { id: userID } = req.user;
      const { orderId } = req.query;
    
      let connection; // Declare a connection variable
    
      try {
        // Get a connection from the pool
        connection = await DB.getConnection();
    
        // Start the transaction
        await connection.beginTransaction();
    
        // Update queue table status
        const queryUpdate = `UPDATE QueueBookings SET queue_status = 'DECLINE' WHERE id = ?`;
        const valueUpdate = [orderId];
        await connection.query(queryUpdate, valueUpdate);
    
        // Commit the transaction
        await connection.commit();
    
        // return res.status(200).json({ msg: 'Order Rejected' });
      } catch (error) {
        console.log(error);
    
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
    getListOrder: async (req, res) => {

      let connection; 
    
      try {
        // Get a connection from the pool
        connection = await DB.getConnection();

        const query = `
        SELECT
        a.id,
        b.username,
        a.book_date,
        a.rental_start_date,
        a.rental_end_date,
        a.queue_status,
        a.discount_applied,
        a.rental_price,
        c.address,
        c.display_name,
        c.phone
        FROM QueueBookings a
        LEFT JOIN Admins b
        ON a.admin_id = b.id
        LEFT JOIN Users c
        ON c.id = a.customer_id
        `;
        const [orderInfo] = await connection.query(query);
    
        if (orderInfo) {
          return res.status(200).json(orderInfo);
        } else {
          return res.status(404).json({ msg: 'Order not found' });
        }
      } catch (error) {
        console.log(error);
    
        return res.status(500).json({ msg: 'Server Error' });
      } finally {
        // Release the connection back to the pool
        if (connection) {
          connection.release();
        }
      }
    },
    getOrderDetail: async (req, res) => {
      const { orderId } = req.query;

      let connection; 
    
      try {
        // Get a connection from the pool
        connection = await DB.getConnection();

        const query = `
        SELECT
            b.booking_id,
            b.game_id,
            c.game_name,
            c.developer,
            c.price,
            a.book_date,
            a.rental_start_date,
            a.rental_end_date,
            d.username AS adminUsername,
            e.username AS customerUsername,
            e.address,
            MAX(img.filepath) AS filepath
        FROM QueueBookings a
        LEFT JOIN BookingItems b ON a.id = b.booking_id
        LEFT JOIN Games c ON c.id = b.game_id
        LEFT JOIN Admins d ON a.admin_id = d.id
        LEFT JOIN Users e ON a.customer_id = e.id
        LEFT JOIN FileLink fl ON fl.gameID = c.id
        LEFT JOIN images img ON img.id = fl.fileID
        WHERE b.booking_id =  ${orderId}
        GROUP BY
            b.booking_id,
            b.game_id,
            c.game_name,
            c.developer,
            c.price,
            a.book_date,
            a.rental_start_date,
            a.rental_end_date,
            d.username,
            e.username,
            e.address

        `;
        const [orderDetail] = await connection.query(query);
    
        if (orderDetail) {
          return res.status(200).json({ orderDetail: orderDetail });
        } else {
          return res.status(404).json({ msg: 'Order not found' });
        }
      } catch (error) {
        console.log(error);
    
        return res.status(500).json({ msg: 'Server Error' });
      } finally {
        // Release the connection back to the pool
        if (connection) {
          connection.release();
        }
      }
    },
    editOrder: async (req, res) => {
      const json = req.body

      const { queue_status } = req.query

      const { orderId } = req.query;
      
      const connection = await DB.getConnection();

      try {
        await connection.beginTransaction();

        const keyObject = Object.keys(json);

        const queryUpdate = keyObject.map(key => {
          return `${key} = '${json[key]}'`
        }).join(', ')

        // console.log("queryUpdate", queryUpdate)
        if(queryUpdate) {
          const query = `UPDATE QueueBookings SET 
          ${queryUpdate}
          WHERE id = ${orderId}`;
  
          await connection.query(query);
        }

        await connection.commit();

        if(queue_status === 'DONE') {
          order.accept(req, res)
        }
        else if(queue_status === 'DECLINE') {
          order.reject(req, res)
        } 

        return res.status(200).json({ msg: 'Order Updated' });
        
      } catch (error) {
        console.log(error)    
        if (connection) {
          await connection.rollback();
        }
    
      } finally {

        if (connection) {
          connection.release();
        }
      }

    }
}

module.exports = order